/* Ear Trainer quiz engine: Web Audio synthesis, question flow, answer
 * checking and progress saving. Reads window.EARTRAINER_CURRICULUM and
 * calls the app's /api/progress and /api/attempts routes. Auth follows the
 * starter template: token from ?token= forwarded via x-usernode-token.
 */
(function () {
  'use strict';

  var CURRICULUM = window.EARTRAINER_CURRICULUM;

  var params = new URLSearchParams(window.location.search);
  var TOKEN = params.get('token') || '';
  var HEADERS = TOKEN ? { 'x-usernode-token': TOKEN } : {};

  var home = document.getElementById('home-screen');
  var quiz = document.getElementById('quiz-screen');
  var homeMessage = document.getElementById('home-message');
  var groupsRoot = document.getElementById('lesson-groups');
  var quizTitle = document.getElementById('quiz-title');
  var quizDesc = document.getElementById('quiz-desc');
  var sizeChoice = document.getElementById('size-choice');
  var sizeList = document.getElementById('size-list');
  var startBtn = document.getElementById('start-btn');
  var quizArea = document.getElementById('quiz-area');
  var playbackError = document.getElementById('playback-error');
  var playBtn = document.getElementById('play-btn');
  var feedback = document.getElementById('feedback');
  var answersEl = document.getElementById('answers');
  var nextBtn = document.getElementById('next-btn');
  var progressEl = document.getElementById('quiz-progress');
  var resultsEl = document.getElementById('results');
  var scoreEl = document.getElementById('score');
  var retryBtn = document.getElementById('retry-btn');
  var backBtn = document.getElementById('back-btn');
  var backBtn2 = document.getElementById('back-btn2');

  // ---------- theme ----------
  // Resolves the light/dark mode the same way as the inline head script in
  // index.html: the system preference decides, falling back to dark when
  // nothing reports one.
  function resolveThemeMode() {
    var mode = 'dark';
    if (window.matchMedia) {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) mode = 'dark';
      else if (window.matchMedia('(prefers-color-scheme: light)').matches) mode = 'light';
    }
    return mode;
  }

  function applyTheme(mode) {
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }

  applyTheme(resolveThemeMode());
  if (window.matchMedia) {
    var themeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    var themeListener = function () { applyTheme(resolveThemeMode()); };
    if (typeof themeQuery.addEventListener === 'function') {
      themeQuery.addEventListener('change', themeListener);
    } else if (typeof themeQuery.addListener === 'function') {
      themeQuery.addListener(themeListener); // older Safari
    }
  }

  // State
  var lesson = null;
  var size = null;
  var activeSet = [];
  var questions = [];
  var questionIndex = 0;
  var correctCount = 0;
  var answered = false;
  var progressRows = []; // [{ lessonId, size, correct, total }]
  var audioCtx = null;

  // ---------- helpers ----------

  function fetchProgress() {
    return fetch('/api/progress', { headers: HEADERS }).then(function (res) {
      if (!res.ok) throw new Error('progress fetch failed: ' + res.status);
      return res.json();
    }).then(function (body) {
      progressRows = (body && body.progress) || [];
    });
  }

  function isUnlocked(lessonId) {
    for (var t = 0; t < CURRICULUM.types.length; t++) {
      var group = CURRICULUM[CURRICULUM.types[t]].lessons;
      for (var i = 0; i < group.length; i++) {
        if (group[i].id === lessonId) {
          if (i === 0) return true;
          var prevId = group[i - 1].id;
          for (var j = 0; j < progressRows.length; j++) {
            var row = progressRows[j];
            if (row.lessonId === prevId && row.total > 0 && row.correct / row.total >= 0.8) return true;
          }
          return false;
        }
      }
    }
    return false;
  }

  function bestScore(lessonId) {
    var best = null;
    for (var i = 0; i < progressRows.length; i++) {
      var row = progressRows[i];
      if (row.lessonId === lessonId && row.total > 0) {
        var pct = Math.round((row.correct / row.total) * 100);
        if (best === null || pct > best) best = pct;
      }
    }
    return best;
  }

  function findLesson(lessonId) {
    for (var i = 0; i < CURRICULUM.types.length; i++) {
      var group = CURRICULUM[CURRICULUM.types[i]];
      for (var j = 0; j < group.lessons.length; j++) {
        if (group.lessons[j].id === lessonId) return group.lessons[j];
      }
    }
    return null;
  }

  function renderHome() {
    var html = '';
    CURRICULUM.types.forEach(function (typeKey) {
      var group = CURRICULUM[typeKey];
      html += '<section class="flex flex-col gap-3">';
      html += '<h2 class="text-sm font-medium text-zinc-500 dark:text-zinc-500 px-1">' + group.name + '</h2>';
      group.lessons.forEach(function (ls) {
        var unlocked = isUnlocked(ls.id);
        var best = bestScore(ls.id);
        var base = 'rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 flex flex-col gap-1 transition-colors ';
        if (unlocked) {
          html += '<button type="button" data-lesson="' + ls.id + '" class="' + base +
            'hover:border-violet-500 text-left cursor-pointer">';
        } else {
          html += '<div class="' + base + 'opacity-50 cursor-not-allowed">';
        }
        html += '<div class="flex justify-between items-baseline gap-2">';
        html += '<span class="font-semibold text-zinc-900 dark:text-zinc-100 text-base">' + ls.name + '</span>';
        if (best !== null) {
          html += '<span class="text-xs text-violet-300 font-mono shrink-0">Best ' + best + '%</span>';
        }
        html += '</div>';
        html += '<p class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">' + ls.description + '</p>';
        if (!unlocked) {
          html += '<p class="text-xs text-zinc-500 dark:text-zinc-600 mt-1">Pass the previous lesson to unlock</p>';
        }
        html += unlocked ? '</button>' : '</div>';
      });
      html += '</section>';
    });
    groupsRoot.innerHTML = html;

    groupsRoot.querySelectorAll('button[data-lesson]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openLesson(btn.getAttribute('data-lesson'));
      });
    });
  }

  // ---------- audio ----------

  function ensureAudio() {
    if (!audioCtx) {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      audioCtx = new Ctx();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function playNotes(voices) {
    // voices: [{ semitone, delay }] — semitones above/below C4.
    var ctx = ensureAudio();
    if (!ctx) {
      playbackError.classList.remove('hidden');
      return;
    }
    var now = ctx.currentTime;
    var baseFreq = 261.63; // C4
    voices.forEach(function (v) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      var freq = baseFreq * Math.pow(2, v.semitone / 12);
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + v.delay);
      gain.gain.linearRampToValueAtTime(0.3, now + v.delay + 0.05);
      gain.gain.setValueAtTime(0.3, now + v.delay + 0.6);
      gain.gain.linearRampToValueAtTime(0, now + v.delay + 0.9);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + v.delay);
      osc.stop(now + v.delay + 1.0);
    });
  }

  function playItem(item) {
    var voices = [];
    if (lesson && lesson.id.indexOf('intervals-') === 0) {
      // two notes played one after the other, starting on C4
      voices.push({ semitone: 0, delay: 0 });
      voices.push({ semitone: item.semitones, delay: 1.1 });
    } else if (item.recipe) {
      // one chord played all at once, rooted on C4
      item.recipe.forEach(function (s) {
        voices.push({ semitone: s, delay: 0 });
      });
    } else if (item.roman) {
      // progression: each chord rooted on C3, one after another
      var chordRecipes = {
        I: [0, 4, 7], ii: [2, 5, 9], iii: [4, 7, 11], IV: [5, 9, 12],
        V: [7, 11, 14], vi: [9, 12, 16],
      };
      item.roman.forEach(function (r, i) {
        var recipe = chordRecipes[r] || [0, 4, 7];
        recipe.forEach(function (s) {
          voices.push({ semitone: s - 12, delay: i * 1.1 });
        });
      });
    }
    playNotes(voices);
  }

  // ---------- quiz flow ----------

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function itemName(item) {
    return item.name;
  }

  function showSizeChoice() {
    sizeChoice.classList.remove('hidden');
    quizArea.classList.add('hidden');
    quizArea.classList.remove('flex');
    resultsEl.classList.add('hidden');
    playBtn.classList.add('hidden');
    answersEl.innerHTML = '';
    feedback.textContent = '';
    nextBtn.classList.add('hidden');
    progressEl.classList.add('hidden');
    playbackError.classList.add('hidden');
  }

  function showQuizArea() {
    sizeChoice.classList.add('hidden');
    resultsEl.classList.add('hidden');
    quizArea.classList.remove('hidden');
    quizArea.classList.add('flex');
  }

  function openLesson(lessonId) {
    lesson = findLesson(lessonId);
    if (!lesson) return;
    size = null;
    activeSet = [];
    questions = [];
    correctCount = 0;
    questionIndex = 0;
    answered = false;
    quizTitle.textContent = lesson.name;
    quizDesc.textContent = lesson.description;
    home.classList.add('hidden');
    quiz.classList.remove('hidden');
    showSizeChoice();
    renderSizes();
    window.scrollTo(0, 0);
  }

  function renderSizes() {
    var options = [
      { key: 'small', label: 'Small', n: 3 },
      { key: 'medium', label: 'Medium', n: 5 },
      { key: 'large', label: 'Large', n: lesson.items.length },
    ];
    sizeList.innerHTML = '';
    options.forEach(function (opt) {
      var label = document.createElement('label');
      label.className = 'flex items-center gap-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-3 cursor-pointer hover:border-violet-500 transition-colors';
      var input = document.createElement('input');
      input.type = 'radio';
      input.name = 'quiz-size';
      input.value = opt.key;
      input.className = 'accent-violet-600';
      if (opt.key === 'small') input.checked = true;
      var span = document.createElement('span');
      span.className = 'text-sm text-zinc-800 dark:text-zinc-200 flex-1';
      span.textContent = opt.label + ' — ' + (opt.key === 'large' ? 'all ' + opt.n : opt.n) + (opt.n === 1 ? ' sound' : ' sounds');
      label.appendChild(input);
      label.appendChild(span);
      sizeList.appendChild(label);
    });
  }

  function buildQuestions() {
    var setSize = { small: 3, medium: 5, large: lesson.items.length }[size];
    activeSet = lesson.items.slice(0, Math.min(setSize, lesson.items.length));
    questions = [];
    for (var i = 0; i < 10; i++) {
      questions.push(activeSet[Math.floor(Math.random() * activeSet.length)]);
    }
    questionIndex = 0;
    correctCount = 0;
    answered = false;
    showQuizArea();
    progressEl.classList.remove('hidden');
    playBtn.classList.remove('hidden');
    playBtn.disabled = false;
    showQuestion();
  }

  function showQuestion() {
    answered = false;
    var item = questions[questionIndex];
    feedback.textContent = '';
    playbackError.classList.add('hidden');
    nextBtn.classList.add('hidden');
    playBtn.disabled = false;
    progressEl.textContent = 'Question ' + (questionIndex + 1) + ' of 10 · ' + correctCount + ' correct';
    renderAnswers(activeSet, item);
    playItem(item);
  }

  function renderAnswers(choices, correctItem) {
    answersEl.innerHTML = '';
    var shuffled = shuffle(choices);
    shuffled.forEach(function (item) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-3 text-left text-sm text-zinc-900 dark:text-zinc-100 hover:border-violet-500 transition-colors cursor-pointer';
      btn.textContent = itemName(item);
      btn.disabled = false;
      btn.addEventListener('click', function () {
        if (answered) return;
        answered = true;
        var isRight = itemName(item) === itemName(correctItem);
        if (isRight) {
          correctCount++;
          btn.classList.add('border-green-600', 'bg-green-600/20', 'text-green-300');
          feedback.textContent = 'Correct!';
        } else {
          btn.classList.add('border-red-600', 'bg-red-600/20', 'text-red-300');
          feedback.textContent = 'Not quite — that was ' + itemName(correctItem) +
            (correctItem.source ? ' ("Sounds like: ' + correctItem.source + '")' : '') + '.';
        }
        // highlight the correct answer on the other buttons
        Array.prototype.forEach.call(answersEl.children, function (child) {
          child.disabled = true;
          if (child.textContent === itemName(correctItem) && child !== btn) {
            child.classList.add('border-green-600', 'bg-green-600/20', 'text-green-300');
          }
        });
        playBtn.disabled = true;
        progressEl.textContent = 'Question ' + (questionIndex + 1) + ' of 10 · ' + correctCount + ' correct';
        nextBtn.textContent = (questionIndex === questions.length - 1) ? 'See results' : 'Next question';
        nextBtn.classList.remove('hidden');
      });
      answersEl.appendChild(btn);
    });
  }

  function finishRun() {
    scoreEl.textContent = correctCount + ' of 10 — ' + Math.round((correctCount / 10) * 100) + '%';
    quizArea.classList.add('hidden');
    quizArea.classList.remove('flex');
    sizeChoice.classList.add('hidden');
    resultsEl.classList.remove('hidden');

    fetch('/api/attempts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-usernode-token': TOKEN },
      body: JSON.stringify({ lessonId: lesson.id, size: size, correct: correctCount, total: 10 }),
    }).then(function () {
      return fetchProgress();
    }).then(function () {
      renderHome(); // refresh best scores / unlock states for next visit
    }).catch(function () {
      // even if saving failed, the user still sees their score
    });
  }

  function backToHome() {
    quiz.classList.add('hidden');
    home.classList.remove('hidden');
    window.scrollTo(0, 0);
  }

  // ---------- wiring ----------

  startBtn.addEventListener('click', function () {
    var picked = sizeList.querySelector('input[name="quiz-size"]:checked');
    if (!picked) return;
    size = picked.value;
    // First question plays inside this click handler, satisfying autoplay rules.
    buildQuestions();
  });

  playBtn.addEventListener('click', function () {
    if (questionIndex < questions.length) playItem(questions[questionIndex]);
  });

  nextBtn.addEventListener('click', function () {
    if (questionIndex < questions.length - 1) {
      questionIndex++;
      showQuestion();
    } else {
      finishRun();
    }
  });

  retryBtn.addEventListener('click', function () {
    size = null;
    showSizeChoice();
  });

  backBtn.addEventListener('click', backToHome);
  backBtn2.addEventListener('click', backToHome);

  // ---------- boot ----------

  fetchProgress()
    .then(renderHome)
    .catch(function () {
      homeMessage.textContent = 'Could not load progress. Open in Homeroom.';
      homeMessage.classList.remove('hidden');
      renderHome(); // still render lessons; without progress only first lessons unlock
    });
})();
