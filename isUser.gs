function isUser(rowRange, rowIndex) {
  for(var columnIndex = 0; columnIndex <= cellsInRowToTake; columnIndex++) {
    
    var selectedValue = rowRange[0][columnIndex];
    
    Log.verbose("Reviewing row: " + selectedValue + ", row " + rowIndex + ", column " + (columnIndex));
    
    if(columnIndex == 0) {
      if(selectedValue && selectedValue.length > 2) {
        Log.info("Found name: " + selectedValue + ", at row index " + rowIndex);
      }
      else {
        Log.verbose("User not found on row index " + rowIndex);
        return false;
      }
    }
    
    if(columnIndex > 0 && !isEmpty(selectedValue)) {
      Log.verbose("Cell not empty at index " + columnIndex);
      return false;
    }
  }
  return true;
}
