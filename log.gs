var showInfoLogs = true;
var showVerboseLogs = false;

class Log {
  static always(text) {
    Logger.log(text);
  }
  
  static info(text) {
    if(showInfoLogs) {
      Logger.log(text);
    }
  }
  
  static verbose(text) {
    if(showVerboseLogs) {
      Logger.log(text);
    }
  }
}
