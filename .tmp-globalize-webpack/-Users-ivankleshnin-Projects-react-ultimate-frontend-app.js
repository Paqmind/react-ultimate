(function( root, factory ) {

	// UMD returnExports
	if ( typeof define === "function" && define.amd ) {

		// AMD
		define( ["globalize-runtime/number","globalize-runtime/date"], factory );
	} else if ( typeof exports === "object" ) {

		// Node, CommonJS
		module.exports = factory( require("globalize/dist/globalize-runtime/number"), require("globalize/dist/globalize-runtime/date") );
	} else {

		// Global
		factory( root.Globalize );
	}
}( this, function( Globalize ) {

var validateParameterTypeNumber = Globalize._validateParameterTypeNumber;
var validateParameterPresence = Globalize._validateParameterPresence;
var numberRound = Globalize._numberRound;
var numberFormat = Globalize._numberFormat;
var numberFormatterFn = Globalize._numberFormatterFn;
var validateParameterTypeDate = Globalize._validateParameterTypeDate;
var dateFormat = Globalize._dateFormat;
var dateFormatterFn = Globalize._dateFormatterFn;

Globalize.a1378886668 = numberFormatterFn(["",,1,,,,,,,,"","0","-0","-","",numberRound(),"∞","NaN",{".":".",",":",","%":"%","+":"+","-":"-","E":"E","‰":"‰"},]);
Globalize.a595906642 = dateFormatterFn({"1":Globalize("en").numberFormatter({"raw":"0"})}, {"pattern":"M/d/y","timeSeparator":":"});

Globalize.locale("en"); return Globalize;

}));
