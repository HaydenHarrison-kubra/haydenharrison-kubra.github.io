// Word lists used by the rules. Glossary product names and abbreviations are added automatically at build time.

// Kept capitalized by the sentence-case check (in addition to glossary product names and brands).
export const properNouns = [
  "KUBRA", "MyHQ+", "MyHQ", "BizHQ+", "BizHQ",
  "Visa", "Mastercard", "American Express", "Discover", "Google Pay", "Venmo", "Zelle", "Android", "iOS", "iPhone", "Wi-Fi",
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
  "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",
  "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Jan", "Feb", "Mar", "Apr", "Jun", "Jul", "Aug", "Sep", "Sept", "Oct", "Nov", "Dec"
];

// Allowed in all caps (not flagged as "all caps formatting").
export const acronyms = [
  "ACH", "AI", "AM", "API", "ATM", "CAD", "CNAME", "CSV", "CTA", "CVV", "EDT", "EST", "ET", "EZ-PAY", "FAQ", "GST", "HELP", "HQ", "HST",
  "ID", "IRS", "IVR", "KUBRA", "MFA", "OG&E", "AT&T", "OK", "OTP", "PAN", "PDF", "PIN", "PM", "PST", "QR", "RCP", "RTN", "SMS", "SSN",
  "SSO", "STOP", "START", "UNSTOP", "UNSUBSCRIBE", "STOPALL", "QUIT", "CANCEL", "END", "INFO", "SUS", "TD", "UI", "URL", "US", "USA", "USD", "UX", "VAT", "ZIP", "MM", "DD", "YY", "YYYY", "HH"
];

// Words that end in a period without ending a sentence.
export const abbreviations = [
  "e.g", "i.e", "etc", "vs", "approx", "incl", "no", "a.m", "p.m", "mr", "mrs", "ms", "dr", "st", "jr", "sr", "inc", "ltd", "co",
  "dept", "est", "min", "max", "sec", "hr", "hrs", "ft", "oz", "lb", "lbs", "u.s", "acct"
];

// "a" vs "an": spellings whose sound overrides the first letter.
export const anPrefixes = ["hour", "honest", "honor", "honour", "heir"];
export const aPrefixes = ["one", "once", "uni", "use", "usa", "usu", "eu", "ubi", "uti"];

// Common misspellings (lowercase) and their corrections.
export const misspellings = {
  acces: "access", acess: "access", accomodate: "accommodate", accomodation: "accommodation", acount: "account", accout: "account",
  adress: "address", adresses: "addresses", agian: "again", alot: "a lot", amout: "amount", ammount: "amount", apparantly: "apparently",
  authentification: "authentication", availible: "available", avaiable: "available", avalable: "available", balence: "balance",
  begining: "beginning", beleive: "believe", billng: "billing", buisness: "business", calender: "calendar", cancelation: "cancellation",
  cancle: "cancel", comming: "coming", commited: "committed", completly: "completely", confirmaton: "confirmation", confrim: "confirm",
  convinience: "convenience", curent: "current", definately: "definitely", definitly: "definitely", diffrent: "different", emial: "email",
  enviroment: "environment", finaly: "finally", foward: "forward", garantee: "guarantee", gaurantee: "guarantee", goverment: "government",
  happend: "happened", immediatly: "immediately", independant: "independent", infomation: "information", informaton: "information",
  insted: "instead", knowlege: "knowledge", maintainance: "maintenance", neccessary: "necessary", necesary: "necessary",
  noticable: "noticeable", notifcation: "notification", notificaiton: "notification", occured: "occurred", occuring: "occurring",
  occurence: "occurrence", ocurred: "occurred", pasword: "password", passowrd: "password", payement: "payment", paymet: "payment",
  paymnet: "payment", posible: "possible", prefered: "preferred", preffered: "preferred", privelege: "privilege", proccess: "process",
  proccessed: "processed", proccessing: "processing", publically: "publicly", reccomend: "recommend", recieve: "receive",
  recieved: "received", recieving: "receiving", reciept: "receipt", recomend: "recommend", recurrance: "recurrence", refered: "referred",
  relevent: "relevant", responce: "response", schedual: "schedule", scheudle: "schedule", seperate: "separate", seperately: "separately",
  shedule: "schedule", sincerly: "sincerely", submited: "submitted", submiting: "submitting", succesful: "successful",
  succesfully: "successfully", successfull: "successful", sucess: "success", sucessful: "successful", sucessfully: "successfully",
  sumbit: "submit", teh: "the", thier: "their", tomorow: "tomorrow", tommorow: "tomorrow", transaciton: "transaction",
  transcation: "transaction", transfered: "transferred", trasaction: "transaction", truely: "truly", untill: "until",
  usernmae: "username", verfication: "verification", verifcation: "verification", wich: "which", wierd: "weird", withdrawl: "withdrawal"
};

// Compound words that are verbs when split ("set up your account" vs. "the setup").
export const splitVerbs = {
  setup: "set up", login: "log in", logout: "log out", signup: "sign up", signin: "sign in", checkout: "check out", backup: "back up", lookup: "look up"
};

// Contracted / full form pairs, for "don't mix styles in one layer".
export const contractions = [
  ["can't", "cannot"], ["can't", "can not"], ["don't", "do not"], ["doesn't", "does not"], ["didn't", "did not"], ["won't", "will not"],
  ["isn't", "is not"], ["aren't", "are not"], ["wasn't", "was not"], ["weren't", "were not"], ["haven't", "have not"], ["hasn't", "has not"],
  ["couldn't", "could not"], ["shouldn't", "should not"], ["wouldn't", "would not"], ["you'll", "you will"], ["you're", "you are"],
  ["we're", "we are"], ["we'll", "we will"], ["it's", "it is"], ["that's", "that is"], ["there's", "there is"]
];

// How Standard Copy is enforced, by Standard Copy category id. `anchors` are lowercase phrases (straight quotes)
// that mean "this layer is trying to be that copy"; if none of the approved versions match, the layer is flagged.
export const standardCopyChecks = {
  "sms-compliance": {
    severity: "error",
    autoFix: false, // the right version depends on the product and program, so a person picks it
    message: "SMS disclosure doesn’t match approved copy",
    anchors: ["message and data rates", "msg & data rates", "msg and data rates", "message frequency varies", "msg frequency varies"]
  },
  "error-messages": {
    severity: "suggestion",
    message: "Consider the standard system error message",
    detail: "If this is a general system error, use the approved message word for word. Specific errors should say what happened and what to do next.",
    anchors: ["something went wrong"]
  }
};
