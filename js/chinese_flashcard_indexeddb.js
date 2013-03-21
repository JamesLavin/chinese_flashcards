var server;

var showLast = function (obj) {
  console.log(JSON.stringify(obj[obj.length - 1]));
};

var showAll = function (obj) {
  console.log(JSON.stringify(obj));
};

var logIt = function (obj) {
  console.log(JSON.stringify(obj))
};

var addItem = function (server, item) {
  server.items.add(item);
};

var addItemAndLog = function (server, item) {
  server.items.add(item).done( function () {
    console.log("added " + JSON.stringify(item));
  });
};

var addItemAttributes = function (server, item) {
  server.items.add(item.attributes);
};

var addItemAttributesUnlessDuplicate = function (server, item) {
  console.log(item.attributes.yingyu);
  //server.items.query('zhongwen').only(item.attributes.zhongwen).filter(function(word) { return word.attributes.yingyu === item.attributes.yingyu}).execute().done(
  //server.items.query().filter('yingyu','to turn around').execute().done(function (results) {
  //server.items.query('yingyu').only(item.attributes.yingyu).filter().execute().done(
  server.items.query().filter('yingyu',item.attributes.yingyu).execute().done(
    function (items) {
      if (items) {
        console.log(items[0].zhongwen + ' already exists');
      } else {
        server.add(item.attributes);
      }
    }
  );
};

var addItemAttributesAndLog = function (server, item) {
  server.items.add(item.attributes).done( function () {
    console.log("added " + JSON.stringify(item.attributes));
  });
};

var zhongwenAlreadyExists = function (server, zhongwen) {
  server.items.query().filter('zhongwen', zhongwen).execute().done(function(items) {
    console.log(zhongwen + ": " + !!items);
    return !!items;
  });
}

var db_config = {
  name: 'database',
  version: 2,
  schema: {
    items: {
      key: { 
        keyPath: 'id',
        autoIncrement: true
      },
      indexes: {
        zhongwen: { unique: false },
        yingyu: { unique: false },
        pinyin: { unique: false }
      }
    }
  }
}

/* WE DON'T STORE WHOLE BACKBONE MODELS IN INDEXEDDB, JUST ATTRIBUTES OBJECTS:
  flashcards.at(1).attributes;
*/

/* TO DELETE DATABASE:
  indexedDB.deleteDatabase("database");
*/

/* TO ADD AN ITEM:
db.open(db_config).done( function(server) {
  var item = { zhongwen: '转过来', yingyu: 'to turn around', pinyin: 'zhuan3 guo4 lai2' };
  // var item = { zhongwen: '法国', yingyu: 'France', pinyin: 'fa3 guo2' };
  server.items.add(item).done( function () { });
}).fail( function(error) {
  console.error("An error occurred: ", error);
});
*/

/* TO UPDATE AN ITEM:
db.open(db_config).done( function(server) {
  server.items.update({id:123, zhongwen: '浪漫', yingyu: 'romantic', pinyin: 'lang4 man4'});
}).fail( function(error) {
  console.error("An error occurred: ", error);
});
*/

/* TO REMOVE ITEMS:
db.open(db_config).done( function(server) {
  for (i=3; i <= 155; i++) {
    server.items.remove( i ).done(function(){ });
  }
}).fail( function(error) {
  console.error("An error occurred: ", error);
});
*/

db.open(db_config).done( function(server) {
  
  function bindAddItemToServer (serv) {
    return function (item) {
      return addItem(serv, item);
    }
  }

  var addItemToServer = bindAddItemToServer(server);

  function bindAddItemAttributesToServer (serv) {
    return function (item) {
      return addItemAttributes(serv, item);
    }
  }

  var addItemAttributesToServer = bindAddItemAttributesToServer(server);

  function bindAddItemAttributesUnlessDuplicateToServer (serv) {
    return function (item) {
      return addItemAttributesUnlessDuplicate(serv, item);
    }
  }

  var addItemAttributesUnlessDuplicateToServer = bindAddItemAttributesUnlessDuplicateToServer(server);

  function bindZhongwenAlreadyExistsOnServer (serv) {
    return function (zhongwen) {
      return zhongwenAlreadyExists(serv, zhongwen);
    }
  }

  var zhongwenAlreadyExistsOnServer = bindZhongwenAlreadyExistsOnServer(server);

  server.items.query().filter('yingyu','to turn around').execute().done(function (results) {
    console.log(JSON.stringify(results));
  });

  // HOW TO ADD ONE BACKBONE MODEL TO INDEXEDDB:
  //addItemToServer(flashcards.at(1).attributes);

  // HOW TO ADD ALL BACKBONE MODELS NOT YET IN INDEXEDDB TO INDEXEDDB:
  flashcards.each(addItemAttributesUnlessDuplicateToServer);

  // HOW TO CONDITIONALLY ADD AN ITEM:
  var item = { zhongwen: '转过来', yingyu: 'to turn around', pinyin: 'zhuan3 guo4 lai2' };
  if (!zhongwenAlreadyExistsOnServer(item.zhongwen)) {
    addItemToServer(item);
  } else {
    console.log(item.zhongwen + " already exists in database server");
  }

  //server.items.query('yingyu').only('yingyu', 'to turn around').execute().done(function (data) { alert(data.length); });
  //server.items.query('yingyu', 'to turn around').filter().execute().done(showAll);
  //server.items.query().filter().execute().done(function (results) {
  //  alert(JSON.stringify(results[results.length - 1]));
  //});

  // HOW TO SHOW EVERYTHING STORED IN INDEXEDDB'S ITEMS:
  server.items.query().filter().execute().done(showAll);
}).fail( function(error) {
    console.error("An error occurred: ", error);
});
