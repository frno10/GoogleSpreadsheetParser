function isQuestionsHeader(rowRange, rowIndex) {
  for(var columnIndex = 0; columnIndex < questionHeaders.length; columnIndex++) {
    
    Log.verbose(">>> Comparing headers: " + rowRange[0][columnIndex] + " to " + questionHeaders[columnIndex]);
    if(rowRange[0][columnIndex] != questionHeaders[columnIndex]) {
      return false;
    }
  }
  return true;
}

function isQuestion(rowRange, rowIndex) {
  for(var columnIndex = 0; columnIndex < 5; columnIndex++) {
    
    // empty column;
    if(columnIndex == 1)
      continue;
    
    Log.verbose(">>> Checking question content at index " + columnIndex + ": " + rowRange[0][columnIndex]);
    
    if(isEmpty(rowRange[0][columnIndex])) {
      return false;
    }
  }
  return true;
}
