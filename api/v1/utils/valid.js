// http://stackoverflow.com/questions/16631064/declare-multiple-module-exports-in-node-js
//--------------------------------------------------------------------------------------------------
function isValidDeviceName(name){
	var allHyphensRegex = /^-*$/;
	var allDigitsRegex = /^\d*$/;
	var validNameRegex = /^[\d\w-]{4,64}$/;
	var hasSpaceRegex = /\s/;
	// name cannot be all digits
	if(allDigitsRegex.test(name)) return false;
	// name cannot be all hyphens
	if(allHyphensRegex.test(name)) return false;
	// invalid name length
	if(name.length < 4 || name.length > 64) return false;
	// name cannot start or end with hyphen
	if(name.charAt(0) === "-" || name.charAt( name.length -1 ) === "-") return false;
	// name cannot contain space
	if(hasSpaceRegex.test(name)) return false;
	// valid name regex
	if(validNameRegex.test(name)) return true;
	return false;
}
//--------------------------------------------------------------------------------------------------
function isValidDescription(description){
	if(description.length < 10 || description.length > 140) return false;
	return true;
}
//--------------------------------------------------------------------------------------------------
function isValidKey(key){
	// allowed symbols
	// - ! $ % ^ & * ( ) _ + | ~ = ` { } [ ] : " ; ' < > ? , . \ /
	var hasSymbolRegex = /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/;
	var hasDigitRegex = /\d/;
	var hasLowerCaseRegex = /[a-z]/;
	var hasUpperCaseRegex = /[A-Z]/;
	if(!key) return false;
	if(key.length < 8 || key.length > 64) return false;
	if(!hasSymbolRegex.test(key)) return false;
	if(!hasDigitRegex.test(key)) return false;
	if(!hasUpperCaseRegex.test(key)) return false;
	return true;
}
//--------------------------------------------------------------------------------------------------
exports.isValidDescription = isValidDescription;
exports.isValidDeviceName = isValidDeviceName;
exports.isValidKey = isValidKey;