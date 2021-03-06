if (!Modernizr.canvastext || !Modernizr.indexeddb) { alert("Your browser does not seem to support HTML5 features we use to create flashcards. You'll need to upgrade before running this program."); };

var Flashcard = Backbone.Model.extend({
  initialize: function(){
    this.on('change', function(){
    });
  },
  display_string: function(){
    return this.get('zhongwen') + ' (' + this.get('yingyu') + ')';
  }
});

var Flashcards = Backbone.Collection.extend({
  model: Flashcard
});

var flashcards = new Flashcards;

flashcards.add([{zhongwen: '中文', yingyu: 'Chinese', pinyin: 'zhong1 wen2'}]);
flashcards.add([{zhongwen: '美国', yingyu: 'America', pinyin: 'mei3 guo2'}]);
flashcards.add([{zhongwen: '老虎', yingyu: 'tiger', pinyin: 'lao3 hu3'}]);
flashcards.add([{zhongwen: '啤酒', yingyu: 'beer', pinyin: 'pi2 jiu3'}]);
flashcards.add([{zhongwen: '吃饭', yingyu: 'to eat', pinyin: 'chi1 fan4'}]);
flashcards.add([{zhongwen: '小孩', yingyu: 'kid/child', pinyin: 'xiao3 hai2'}]);
flashcards.add([{zhongwen: '读书', yingyu: 'to read (a book)', pinyin: 'du2 shu1'}]);
flashcards.add([{zhongwen: '妈妈', yingyu: 'mom, mommy, mother', pinyin: 'ma1 ma'}]);
flashcards.add([{zhongwen: '爸爸', yingyu: 'dad, daddy, father', pinyin: 'ba4 ba'}]);
flashcards.add([{zhongwen: '姐姐', yingyu: '(older) sister', pinyin: 'jie3 jie'}]);
flashcards.add([{zhongwen: '哥哥', yingyu: '(older) brother', pinyin: 'ge1 ge'}]);
flashcards.add([{zhongwen: '弟弟', yingyu: '(younger) brother', pinyin: 'di4 di'}]);
flashcards.add([{zhongwen: '妹妹', yingyu: '(younger) sister', pinyin: 'mei4 mei'}]);

var FlashcardView = Backbone.View.extend({
  initialize: function() {
    this.opts = this.options.opts;
    this.canvas = this.options.canvas;
    this.context = this.canvas.getContext('2d');
    this.context.textAlign = 'center';
    //this.context.textBaseline = 'middle';
    this.context.font = this.opts.zhongwen_ziti;
    this.current_card = 0;
    this.show('zhongwen', this.current_card);
    _.bindAll(this, 'showCard', 'lastCard', 'nextCard', 'flip')
    this.listenTo(this.options.controls, "flipRequested", this.flip);
    this.listenTo(this.options.controls, "prevCardRequested", this.prevCard);
    this.listenTo(this.options.controls, "nextCardRequested", this.nextCard);
    this.listenTo(this.options.controls, "pinyinRequested", this.showPinyin);
  },
  showCard: function(id_num) {
    if (id_num) { this.current_card = id_num };
    if (this.current_card) { this.show('zhongwen', this.current_card) };
  },
  lastCard: function() {
    return this.collection.length - 1;
  },
  showPinyin: function(id_num) {
    if (id_num) { this.current_card = id_num };
    if (this.current_card) { this.show('pinyin'), this.current_card };
  },
  prevCard: function() {
    if (this.current_card > 0) {
      this.current_card -= 1;
    } else {
      this.current_card = this.lastCard();
    }
    this.show('zhongwen', this.current_card);
  },
  nextCard: function() {
    if (this.current_card < this.lastCard()) {
      this.current_card += 1;
    } else {
      this.current_card = 0;
    }
    this.show('zhongwen', this.current_card);
  },
  flip: function() {
    if (this.currentlyShowing == 'zhongwen') {
      $('#flip_card').text('中文');
      this.show('yingyu', this.current_card); 
    } else {
      $('#flip_card').text('英语');
      this.show('zhongwen', this.current_card); 
    }
  },
  show: function(attrib, id_num) {
    if (!id_num) { var id_num = this.current_card; }
    this.currentlyShowing = attrib;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    var display_text = this.collection.at(id_num).get(attrib);
    this.context.fillText(display_text, this.canvas.width/2, this.canvas.height/2);
  }
});

var canvas = document.getElementById('flashcard_canvas');

var CardControlsView = Backbone.View.extend({
  el: $('#card_controls'),
  initialize: function() {
    _.bindAll(this, 'handleFlipCard', 'handlePrevCard', 'handleNextCard', 'handleShowPinyin');
  },
  events: {
    'click #flip_card': 'handleFlipCard',
    'click #prev_card': 'handlePrevCard',
    'click #next_card': 'handleNextCard',
    'click #show_pinyin': 'handleShowPinyin'
  },
  handlePrevCard: function() {
    this.trigger("prevCardRequested");
  },
  handleNextCard: function() {
    this.trigger("nextCardRequested");
  },
  handleFlipCard: function() {
    this.trigger("flipRequested");
  },
  handleShowPinyin: function() {
    this.trigger("pinyinRequested");
  }
});

var cardControlsView = new CardControlsView();

var flashcard_view = new FlashcardView({
  collection: flashcards,
  controls: cardControlsView,
  canvas: canvas,
  opts: {
    yingyu_ziti: "Arial",
    zhongwen_ziti: '50pt FangSong, KaiTi, SimSun, SimHei, "STHeiti Light", STHeiti, STKaiti, STSong, STFangsong, "AR PL UMing CN", "AR PL KaitiM GB" 黑体 华文黑体'}
});
