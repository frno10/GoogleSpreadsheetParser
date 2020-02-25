var cellsInRowToTake = 10;

var teamStartsWith = "Team:";
var questionHeaders = [ 'Otazka', '', 'Najviac','Najmenej'];
var highlightColor = '#fdee89';

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function myFunction() {
  var app = SpreadsheetApp;
  var spreadsheet = app.getActiveSpreadsheet();
  var sheets = spreadsheet.getSheets();
  
  for(var sheetIndex = 0; sheetIndex < sheets.length; sheetIndex++) {
    var sheet = sheets[sheetIndex];
    
    Log.always('Sheet name is ' + sheet.getName());
    
    var users = [];
    var user = undefined;
    
    for(var rowIndex = 1; rowIndex < 100; rowIndex++) {
      
      var userCurrentlyExists = false;    
      var dataValues = sheet.getRange(rowIndex, 1, 1, 10);
      var dataRowValues = dataValues.getValues();
      
      Log.always("Parsing row " + rowIndex + " with values " + dataRowValues.toString());
      
      // TODO remove next few rows;
      
      //var userRow = Expected.emptyRowWith([cell.hasText()]);
      //var userRow = Expected.emptyRowWith([cell.startsWith("Team:")]);
      var userRow = Expected.anyRowWith([cell.hasText(), cell.isEmpty(), 'Najviac']);
      var isOk = rowMeetsCriteria(dataRowValues, userRow, rowIndex);
      Log.always(`Row ${rowIndex} criteria: ${isOk}`);
      continue;
      
      if(!user)
      {
        Log.verbose("Looking for user on row " + rowIndex + ', values: ' + dataRowValues[0].toString());
        var isThisUser = isUser(dataRowValues, rowIndex);
        
        if(isThisUser) {
          Log.info(">>> User " + (isThisUser ? "found !" : "not found... moving on"));
          user = new User(dataRowValues[0][0]);
          continue;
        }
      }
      
      if(user && !user.Team) {
        Log.verbose("Looking for team on row " + rowIndex + ', values: ' + dataRowValues[0].toString());
        var isThisTeam = isTeam(dataRowValues, rowIndex);
              
        if(isThisTeam) {
          Log.info(">>> Team " + (isThisTeam ? "found !" : "not found... moving on"));
          user.Team = dataRowValues[0][0];
          continue;
        }
      }
      
      if(user && user.Team && user.QuestionsHeaderRow.length == 0) {
        Log.verbose("Looking for question headers on row " + rowIndex + ', values: ' + dataRowValues[0].toString());
        var isThisQuestionsHeader = isQuestionsHeader(dataRowValues, rowIndex);
              
        if(isThisQuestionsHeader) {
          Log.info(">>> Questions headers row " + (isThisQuestionsHeader ? "found !" : "not found... moving on"));
          var dataToStore = sheet.getRange(rowIndex, 1, 1, 13).getValues();
          Log.verbose(">>> Saving questions header " + dataToStore[0].toString());
          user.QuestionsHeaderRow = dataToStore[0];
          continue;
        }
      }
      
      if(user && user.Team && user.QuestionsHeaderRow.length > 0) {
        Log.verbose("Looking for question on row " + rowIndex + ', values: ' + dataRowValues[0].toString());
        var isThisQuestion = isQuestion(dataRowValues, rowIndex);
              
        if(isThisQuestion) {
          Log.info(">>> Question row " + (isThisQuestion ? "found !" : "not found... moving on"));
          var dataToStore = sheet.getRange(rowIndex, 1, 1, 13).getValues();
          Log.verbose(">>> Saving questions row " + dataToStore[0].toString());
          user.QuestionsRow.push(dataToStore[0]);
          if(user.QuestionsRow.length == 1) {
            user.FirstQuestionAtRow = rowIndex;
          }
          continue;
        }
        else {
          // storing user and looking for a next one
          users.push(user);
          user = undefined;
        }
      }
    }
    
    Log.always("Found " + users.length + " users, ");
    
    Log.always("Found: " + users.map(function(usr) { return usr.Name + ', ' + usr.Team + ', Questions: ' + usr.QuestionsRow.length + "\r\n"; }));
    
    var maxMatch = 0, minMatch = 0;
    for(var userIndex = 0; userIndex < users.length; userIndex++) { 
      Log.info(`COMPARING USER ${users[userIndex].Name}`);
    
      for(var user2Index = 0; user2Index < users.length; user2Index++) { 
      
        if(userIndex == user2Index)
          continue;
      
        for(var questionIndex = 0; questionIndex < users[userIndex].QuestionsRow.length; questionIndex++) {
            
            var user1 = { "name" : users[userIndex].Name, "max" : users[userIndex].QuestionsRow[questionIndex][2], "row": users[userIndex].FirstQuestionAtRow };
            var user2 = { "name" : users[user2Index].Name, "max" : users[user2Index].QuestionsRow[questionIndex][2], "row": users[user2Index].FirstQuestionAtRow };
            
            Log.verbose(`Comparing ${user1.name}>${user1.max} and ${user2.name}>${user2.max} in question ${users[userIndex].QuestionsRow[questionIndex][0]}
             , ${user1.Name != user2.Name}, ${user1.max == user2.name}, ${user1.name == user2.max}`);
            
            if(user1.name != user2.name // names match
              && user1.max == user2.name 
              && user1.name == user2.max) {
                Log.info(`MAX MATCH >> Comparing ${user1.name}>${user1.max} and ${user2.name}>${user2.max} in question ${users[userIndex].QuestionsRow[questionIndex][0]}`);
                maxMatch++;
                
                Log.verbose(`Highlighting at ${user1.FirstQuestionAtRow + questionIndex}, ${user2.FirstQuestionAtRow + questionIndex}, 3 1 1`);
                
                // try highlight
                sheet.getRange((user1.row + questionIndex), 3, 1, 1).setBackground(highlightColor);
                sheet.getRange((user2.row + questionIndex), 3, 1, 1).setBackground(highlightColor);
            }
        }
      }
    }
    
    Log.always(`Maximum match is ${maxMatch} slash 2 = ${maxMatch/2}`);
    
    for(var userIndex = 0; userIndex < users.length; userIndex++) { 
      Log.info(`COMPARING USER ${users[userIndex].Name}`);
    
      for(var user2Index = 0; user2Index < users.length; user2Index++) { 
      
        if(userIndex == user2Index)
          continue;
      
        for(var questionIndex = 0; questionIndex < users[userIndex].QuestionsRow.length; questionIndex++) {
            
            var user1 = { "name" : users[userIndex].Name, "max" : users[userIndex].QuestionsRow[questionIndex][3], "row": users[userIndex].FirstQuestionAtRow };
            var user2 = { "name" : users[user2Index].Name, "max" : users[user2Index].QuestionsRow[questionIndex][3], "row": users[user2Index].FirstQuestionAtRow };
            
            Log.verbose(`Comparing ${user1.name}>${user1.max} and ${user2.name}>${user2.max} in question ${users[userIndex].QuestionsRow[questionIndex][0]}
             , ${user1.Name != user2.Name}, ${user1.max == user2.name}, ${user1.name == user2.max}`);
            
            if(user1.name != user2.name // names match
              && user1.max == user2.name 
              && user1.name == user2.max) {
                Log.verbose(`MIN MATCH >> Comparing ${user1.name}>${user1.max} and ${user2.name}>${user2.max} in question ${users[userIndex].QuestionsRow[questionIndex][0]}`);
                minMatch++;
                
                // try highlight
                sheet.getRange((user1.row + questionIndex), 4, 1, 1).setBackground(highlightColor);
                sheet.getRange((user2.row + questionIndex), 4, 1, 1).setBackground(highlightColor);
            }
        }
      }
    }
    
    Logger.log(`Minimum match is ${minMatch} slash 2 = ${minMatch/2}`);
  }
}

var User = function(name) {
  this.Name = name;
  this.Team = undefined;
  this.QuestionsHeaderRow = [];
  this.QuestionsRow = [];
  this.FirstQuestionAtRow = 0;
  this.Colleagues = undefined;
  
  this.tryAddAnswers = function(range) {
    for (var row in values) {
      for (var col in values[row]) {
        Logger.log(values[row][col]);
      }
    }
  }
}
