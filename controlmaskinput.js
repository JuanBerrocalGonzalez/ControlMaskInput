/*!
  * ControlMaskInput v1.53 by Juan Berrocal González
  * Copyright 2023 - The ControlMaskInput Author (https://github.com/JuanBerrocalGonzalez)
  * 
  * Control de entrada de datos en los inputs <input type="text", "number", "tel", "url", "email", "password", "date", "time", "datetime-local" o textarea 
  */

let KeyInputOK = false, LastInputValOK = null;
let Lastposcursor_start = 0, Lastposcursor_end = 0;    
var MasksInputList = new Object();

var MaxLengthDate=0, OkTestDate = false;
var OkTestPattern = new Object(); // Objeto Pattern que ha pasado el test
var elemOkTestPattern = null;
var focusout = false;
var LengthOver=false;

// Carga el archivo de configuración MasksInputConfig.ini que deberá encontrarse en la carpeta js/MasksInputList
let MasksInputCountry = 'ES';
let ModeRegExpInputStrong = true;
let SelectAllValueNotOK = true;
let ReplaceCommaNumbers = true;
let DecimalPlaceholder = ',';
let ThousandsSeparator = '.';

var DataFileIni1 = null;

fetch('js/MasksInputList/MasksInputConfig.ini')
  .then((response) => response.text())
  .then(function data(e) {
    DataFileIni1 = e;
})
.catch((error) => {
  console.error('Error:', error);
  DataFileIni1 = "";
}); 

var ValueParam=null;

timeLines1 = setInterval(() => { 
  if (DataFileIni1) {
    clearInterval(timeLines1);  
    if (DataFileIni1.length>0) {
      //Existe un archivo MasksInputConfig.ini y se pasa a cargar los parámetros
      const FileArray = DataFileIni1.split("\n"); 
      //Crea un array con todas las líneas del archivo y se recorren para extraer los valores
      FileArray.forEach(function(elem) {
        //En cada línea elimina salto de línea y espacios al principio y final de la línea
        elem.split("\n").join("");
        elem=elem.trim();
        // Pasa a buscar y cargar cada parámetro de configuración
        if (elem.slice(0,17).toLowerCase() == 'masksinputcountry') {
          ValueParam = elem.substring(elem.indexOf("=", 17)+1);
          ValueParam=ValueParam.trim();
          if (ValueParam.length == 2) {MasksInputCountry=ValueParam;}
          else {console.error('MasksInputCountry = '+ ValueParam +' -> no es válido, se asigna ES');}
          LoadMaskInputCountry (MasksInputCountry);
        }
        else if (elem.slice(0,22).toLowerCase() == 'moderegexpinputdefault') {
          ValueParam = elem.substring(elem.indexOf("=", 22)+1);
          ValueParam=ValueParam.trim();
          if (ValueParam.toLowerCase() == 'light') {ModeRegExpInputStrong = false;}
          else if (ValueParam.toLowerCase() == 'strong') {ModeRegExpInputStrong = true;}
          else {console.error('ModeRegExpInputDefault = ' + ValueParam + ' -> no es válido, se asigna strong');}
        }
        else if (elem.slice(0,19).toLowerCase() == 'selectallvaluenotok') {
          ValueParam = elem.substring(elem.indexOf("=", 19)+1);
          ValueParam=ValueParam.trim();
          if (ValueParam.toLowerCase() == 'false') {SelectAllValueNotOK=false;}
          else if (ValueParam.toLowerCase() == 'true') {SelectAllValueNotOK=true;}
          else {console.error('SelectAllValueNotOK = ' + ValueParam + ' -> no es válido, se asigna true');}
        }
        else if (elem.slice(0,19).toLowerCase() == 'replacecommanumbers') {
          ValueParam = elem.substring(elem.indexOf("=", 19)+1);
          ValueParam=ValueParam.trim();
          if (ValueParam.toLowerCase() == 'false') {ReplaceCommaNumbers=false;}
          else if (ValueParam.toLowerCase() == 'true') {ReplaceCommaNumbers=true;}
          else {console.error('ReplaceCommaNumbers = ' + ValueParam + ' -> no es válido, se asigna true');}
        }  
        else if (elem.slice(0,18).toLowerCase() == 'decimalplaceholder') {
          ValueParam = elem.substring(elem.indexOf("=", 18)+1);
          ValueParam=ValueParam.trim();
          if (ValueParam.length >0) {DecimalPlaceholder=ValueParam;}
          else {console.error('DecimalPlaceholder  -> no tiene valor asignado, se asigna: ' + DecimalPlaceholder);}
        } 
        else if (elem.slice(0,18).toLowerCase() == 'thousandsseparator') {
          ValueParam = elem.substring(elem.indexOf("=", 18)+1);
          ValueParam=ValueParam.trim();
          if (ValueParam.length >0) {ThousandsSeparator=ValueParam;}
          else {console.error('ThousandsSeparator  -> no tiene valor asignado, se asigna: ' + ThousandsSeparator);}
        }                                          
      });
    }
  }
});

function LoadMaskInputCountry (MasksInputCountry) {
  // Carga el archivo INI de máscaras que deberá encontrarse en la carpeta js/MasksInputList
  var DataFileIni2 = null;
  
  fetch('js/MasksInputList/MasksInputList_'+ MasksInputCountry +'.ini')
    .then((response) => response.text())
    .then(function data(e) {
      DataFileIni2 = e;
  })
  .catch((error) => {
    console.error('Error:', error);
    DataFileIni2 = "";
  }); 
  var step=0;
  var MaskName=null;
  var MaskParam=null;

  timeLines2 = setInterval(() => { 
    if (DataFileIni2) {
      clearInterval(timeLines2);  
      if (DataFileIni2.length>0) {
        //Existe un archivo de configuración de máscaras de control y se pasa a cargar en MasksInputList
        const FileArray = DataFileIni2.split("\n"); 
        //Crea un array con todas las líneas del archivo y se recorren para extraer los valores
        FileArray.forEach(function(elem) {
          //En cada línea elimina salto de línea y espacios al principio y final de la línea
          elem.split("\n").join("");
          elem=elem.trim();
          if (elem.slice(0,1) == '[' && elem.slice(-1) == ']') {
            elem=elem.split("[").join("");
            elem=elem.split("]").join("");
            MaskName = elem.toUpperCase();
            if (MasksInputList[MaskName] == undefined) {
              //Esta máscara no existe en la Lista y se añade a la lista
              MasksInputList[MaskName] = {
                type: null,
                modestrong: ModeRegExpInputStrong,
                regexpinput: null,
                regexpoutput: null,
                length: null,
                filldatetimevalue2: null
              };
            } 
            step=1;
          }
          else if (elem.slice(0,4).toLowerCase() == 'type' && step<8) {
            MaskParam = elem.substring(elem.indexOf("=", 4)+1);
            MaskParam=MaskParam.trim();
            MasksInputList[MaskName].type=MaskParam;
            step++;
          }
          else if (elem.slice(0,15).toLowerCase() == 'moderegexpinput' && step<8) {
            MaskParam = elem.substring(elem.indexOf("=", 15)+1);
            MaskParam=MaskParam.trim();

            if (MaskParam.toLowerCase() == 'light') {MaskParam = false;}
            else if (MaskParam.toLowerCase() == 'strong') {MaskParam = true;}
            else {
              console.error('[' + MaskName + '] ModeRegExpInput = ' + MaskParam + ' -> no es válido, se asigna ModeRegExpInputDefault');
              MaskParam = ModeRegExpInputStrong;
            }
            MasksInputList[MaskName].modestrong=MaskParam;
            step++;
          }            
          else if (elem.slice(0,11).toLowerCase() == 'regexpinput' && step<8) {
            MaskParam = elem.substring(elem.indexOf("=", 11)+1);
            MaskParam=MaskParam.trim();
            MasksInputList[MaskName].regexpinput=MaskParam;
            step++;
          }  
          else if (elem.slice(0,6).toLowerCase() == 'length' && step<8) {
            MaskParam = elem.substring(elem.indexOf("=", 6)+1);
            MaskParam=MaskParam.trim();
            MasksInputList[MaskName].length=MaskParam;
            step++;
          } 
          else if (elem.slice(0,12).toLowerCase() == 'regexpoutput' && step<8) {
            MaskParam = elem.substring(elem.indexOf("=", 12)+1);
            MaskParam=MaskParam.trim();
            MasksInputList[MaskName].regexpoutput=MaskParam;           
            step++;
          } 
          else if (elem.slice(0,11).toLowerCase() == 'valueformat' && step<8) {
            MaskParam = elem.substring(elem.indexOf("=", 11)+1);
            MaskParam=MaskParam.trim();
            MasksInputList[MaskName].valueformat=MaskParam;           
            step++;
          }             
          else if (elem.slice(0,18).toLowerCase() == 'filldatetimevalue2' && step<8) {
            MaskParam = elem.substring(elem.indexOf("=", 18)+1);
            MaskParam=MaskParam.trim();
            MasksInputList[MaskName].filldatetimevalue2=MaskParam;           
            step++;
          }           
        });
        console.table (MasksInputList);
      }
    }
  });
}

function ControlRegExpMaskInput(maskinput, value, regex='regexpinput', modeInsert=false, full=false) {
  //Función que controla la entrada de datos a un input o textarea con la etiqueta maskinput

  if (MasksInputList[maskinput] == undefined) {return;}  
  else {maskinput = maskinput.toUpperCase();} 
  if (MasksInputList[maskinput].type == 'number' || MasksInputList[maskinput].type == 'code') {
    // Hay que dejar pasar solamente números, punto y coma 
    arrayKey = value.split('',value.length);
    arrayKey.forEach(function(chr) {
      if (!(Number(chr) || chr=='0' || chr==',' || chr=='.')) {return false;}
    });
  }
  else if (!(MasksInputList[maskinput].type != 'text' || MasksInputList[maskinput].type != 'datetime')) {return false;}
  var OK = true;
  if (MasksInputList[maskinput][regex]) {
    var length = MasksInputList[maskinput].length;  LengthOver=false;
    if (length && value.length > length) {
      OK=false; LengthOver=true;
    }
    else if (MasksInputList[maskinput].type == 'datetime') {
      OK = TestDateTime(value, MasksInputList[maskinput][regex], modeInsert, full);
    }    
    else {
      const DateRegExpArray = MasksInputList[maskinput][regex].split("||");
      // Pueden venir varias expresiones regulares separadas por ||
      // En cuanto una de las expresiones regulares valide los datos introducido, la función deja de comprobar y retorna true
      var tester=true;
      DateRegExpArray.forEach(function(elem) {
        if (tester) {
          elem = elem.trim(); //Quita los espacios del principio y del final
          if (elem.indexOf("/")==0) {
            //Es una Expresión Regular y quita las barras de inicio y final de RegExp y separa los caracteres flags
            if (elem.indexOf("/")>-1) {
              elem = elem.substring(elem.indexOf("/")+1);
            }
            if (elem.lastIndexOf("/")>0) {
              var flags = elem.substring(elem.lastIndexOf("/")+1);
              elem = elem.substring(0,elem.lastIndexOf("/"));
            }
            elem = new RegExp(elem,flags);
          }
          if (typeof(elem) == 'object') {
            var Rexp = new RegExp(elem);
            OK = Rexp.test(value); 
          }
          if (OK) {tester=false;}
        }
      });
    }
    if(MasksInputList[maskinput].type == 'datetime' && modeInsert && MaxLengthDate>value.length && !OK) {
      // Para DateTime cuando está en modo Insertar y no ha superado la longitud del pattern más largo y no pasó el test
      // Se hace que lo pase puesto que está insertando el valor de la fecha
      OK=true;
    }    
    if (!OK) {
      //Ha sobrepasado la longitud o la Expresión Regular u otros Controles y se ignora lo tecleado
      if (!full) {
        if (LengthOver || MasksInputList[maskinput].modestrong) {OK=false;}
      }
    }     
  }
  //-----------------------------------------------------------------
  return OK;  
}

function TestDateTime (value, DateRegExp, modeInsert = false, full = false) {
  // Función para validar los datos que se introducen por el teclado en función del DateRegExp dado (solo Fecha, Hora)
  // DateRegExp puede contener varias máscaras de control de fecha. Estas deben venir separadas por ||
  // En cuanto una de las máscaras valide los datos introducido, la función deja de comprobar y retorna true
  // Si full es false se valida conforme se teclean los datos. Si es true se valida toda la máscara
  const DateRegExpArray = DateRegExp.split("||");
  //var element = event.target;
  var OK = false
  //, modeInsert = element.selectionEnd+1 < value.length; 
  //var LongTotal=false;
  OkTestPattern = new Object();
  DateRegExpArray.forEach(function(elem) {
    //Se ha creado un array donde cada elemento contiene una de las máscaras dadas por DateRegExp
    elem = elem.trim(); //Quita los espacios del principio y del final
    var pattern = new Object(); 
    var length = 0; // Longitud máxima de digitos que admite la máscara de control
    for (var i = 0; i< elem.length; i++) {
      // Este bucle recorre cada caracter de control de la máscara a validar y toma los caracteres de control
      // para construir una plantilla (pattern) con las características de cada caracter de la máscara
      var char = elem.charAt(i)
      var MinValue = 0,  MaxValue = 0, symbol = false;
      var chr = 0;   //Número de caracteres que puede contener el carácter de control
      var optchr = 0 //Número de caracteres opcionales que puede contener el carácter de control
                     // Por defecto está en ok, ya que la introdución de datos vendrá de izquierda a derecha en incremento y mientras
                     // no se rellene todos los digitos no se podrá chequear los caracteres a la derecha.
      switch (char) {
        case 'd': MinValue = 1; MaxValue = 31; chr = 2; optchr = 0; break;
        case 'j': MinValue = 1; MaxValue = 31; chr = 2; optchr = 1; break;
        case 'm': MinValue = 1; MaxValue = 12; chr = 2; optchr = 0; break;
        case 'n': MinValue = 1; MaxValue = 12; chr = 2; optchr = 1; break;
        case 'Y': MinValue = 1; MaxValue = 9999; chr = 4; optchr = 0; break;
        case 'y': MinValue = 1; MaxValue = 99; chr = 2; optchr = 0; break;
        case 'H': MinValue = 0; MaxValue = 23; chr = 2; optchr = 0; break;
        case 'G': MinValue = 0; MaxValue = 23; chr = 2; optchr = 1; break;
        case 'i': MinValue = 0; MaxValue = 59; chr = 2; optchr = 0; break;
        case 's': MinValue = 0; MaxValue = 59; chr = 2; optchr = 0; break;
        case 'u': MinValue = 0; MaxValue = 999; chr = 3; optchr = 0; break;
        case '/': MinValue = 0; MaxValue = 0; chr = 1; optchr = 0; symbol = true; break;
        case '-': MinValue = 0; MaxValue = 0; chr = 1; optchr = 0; symbol = true; break;
        case ':': MinValue = 0; MaxValue = 0; chr = 1; optchr = 0; symbol = true; break;
        case '.': MinValue = 0; MaxValue = 0; chr = 1; optchr = 0; symbol = true; break;
        case ' ': MinValue = 0; MaxValue = 0; chr = 1; optchr = 0; symbol = true; break;
        case 'T': MinValue = 0; MaxValue = 0; chr = 1; optchr = 0; symbol = true; break;
      }
      // Añade una celda a la plantilla (pattern) con los datos del caracter de control
      pattern[i] = {
        char : char, str : null, MinValue : MinValue, MaxValue : MaxValue, chr : chr, optchr : optchr, symbol : symbol
      }
      length = length + chr;   
    }
    if (length>MaxLengthDate) {MaxLengthDate=length;}
    if (value.length <= length) {
      //--------------------------------------------------------------------------------------------------
      // A partir de aquí Rellenamos la plantilla (pattern) con los dígitos introducidos para ver si cumple con los criterios
      var posc = 0, tester = true;
      var n = Object.keys(pattern).length;
      for (var i = 0; i < n; i++) {
        // Este bucle recorre cada elemento de control de la máscara (pattern) y toma de value los datos que hay que validar 
        // Se sale del bucle con tester en false cuando algo no corresponde con lo marcado en pattern.
        let val = value.slice(posc,posc+pattern[i].chr)
        let isnumber=true;
        if (pattern[i].symbol) {
          // Este elemento de pattern es un simbolo y se comprueba que la parte correspondiente de value sea el mismo simbolo
          if (pattern[i].char == val) {
            pattern[i].str = val; posc=posc+pattern[i].chr;           
          }
          else {
            if (modeInsert && parseInt(val.slice(v,v+1)) >=0 && parseInt(val.slice(v,v+1))<=9) {
              //La parte correspondiente del value no es un simbolo sino un número y como se está en modo Insertar 
              //ignora el tester para saltar a la siguiente posición
              tester=false; 
            }
            else {tester=false; break;}
          }
        }
        else {
          // Este elemento de pattern no es un simbolo y se comprueba que la parte de value sea numérica
          for (var v = 0; v<val.length; v++) {
            // Se comprueba que el valor a dar a la celda de pattern sea numérico
            if (!(parseInt(val.slice(v,v+1)) >=0 && parseInt(val.slice(v,v+1))<=9)) {
              if (pattern[i].optchr>0 && pattern[i].chr>1 && v>0) {
                //Este elemento de control tiene 1 caracter opcional y el primero es númerico pero el segundo no lo es,
                //se rehace str con 1 dígito menos para que no lleve el simbolo que pertenecerá a la siguiente celda.
                val = value.slice(posc,posc+pattern[i].chr-pattern[i].optchr);
                posc=posc-pattern[i].optchr; length = length - pattern[i].optchr;
              }
              else {isnumber=false; tester=false; break;}
            } 
          }
          if (isnumber) {
            //Asigna a str la parte del value correspondiente
            pattern[i].str = val; posc=posc+pattern[i].chr;
          } 
          else {break;}
        }
        if (value.length > length) {tester=false; break;}
        if (posc>=value.length) {break;}
      }
      if (tester) { 
        OK = DateIsOkPatternDateTime (pattern, full);   
        OkTestDate=OK;  
        if (OK) {OkTestPattern = pattern; elemOkTestPattern=elem;}
      }           
      //--------------------------------------------------------------------------------------------
    }
    if (OK && (!modeInsert || value.length >= length)) {
      // La máscara ha validado correctamente y No está en modo Insertar o se ha llegado a la longitud
      // y debe finalizar retornando true
      return OK; 
    }  
  })
  return OK;
}

//-------------------------------------------------------------------------------------------------------------------------------------------
// Para la cadena de patrón de control y formato de DATETIME podemos usar los siguientes caracteres de parámetros:
// d – Día del mes de 01 al 31.
// j – Día del mes sin 0 para los números inferiores a 10, del 1 to 31.
// m – Número de mes de 01 a 12.
// n – Número de mes sin 0, del 1 al 12.
// Y – Año en 4 dígitos.
// y – Año en 2 dígitos.
// H – Hora con formato de 00 a 23.
// G - Hora sin 0, con formato de 0 a 23.
// i – Minutos de 00 a 59.
// s – Segundos de 00 a 59. 
// u – Microsegundos de 0 a 999.
// / - Separador Día/Mes/Año  <-- u otros caracteres como: - . o espacio
// : - Separador Minutos:Segundos
// . - Separador de Microsegundos  
// space - Separador entre date y time
// T - Separador entre date y time
// Ejemplo: la máscara d/m/Y valida de la siguiente manera:
//          una fecha con el día 01 al 31, un separador /, el mes 01 al 12, otro separador / y el año del 0001 al 9999
//          la máscara dmY valida igual pero no lleva los separadores
//  
//    NOTA: Los caracteres sin cero delante como j,n y G deberan usarse con separadores. j/n/Y  no es válido -> jnY  (...de momento)
//          Se pueden incluir varias máscaras separadas por ||
//          Ejemplo: RegExpInput=d/m/Y || dmY || d/m/Y H:i    <----(Si alguna es validada se dará por buena)  
//-------------------------------------------------------------------------------------------------------------------------------------------

function DateIsOkPatternDateTime (pattern, full = false, ValueFormat = null) {
  // Aquí se comprueba que pattern tenga una Fecha correcta o también se devuelve
  // la fecha del objeto pattern formateada como indique ValueFormat
  var today = new Date();
  var n = Object.keys(pattern).length;
  var OK=true, y=0, m=0, d=0, ly=true, h=0, i=0, s=0, u=0;
  var YY='',YYYY='',M='',MM='', D='', DD='', H='', HH='', I='', S='', U='';
  var year = today.getFullYear().toString();
  var month = today.getMonth()+1; month = month.toString();
  for (var e = 0; e< n; e++) {
    // Recorremos pattern para extraer día, mes y año para comprobar meses de 30 días y febrero 28 o 29
    if (pattern[e].char == 'Y' || pattern[e].char == 'y') {
      // Años ----------------
      if (ValueFormat) {
        if (pattern[e].str == null) {pattern[e].str = year.slice(0-pattern[e].chr);}
        if (pattern[e].str.length < pattern[e].chr) {
        //Año con menos dígitos de lo indicado en chr y se rellena por delante con year
        z = pattern[e].chr - pattern[e].str.length; pattern[e].str = year.slice(0,z) + pattern[e].str;
        }
      }
      if (pattern[e].str != null) {
        y=pattern[e].str; YY=y ; YYYY=y; 
        // YY es para tener el año con 2 dígitos y YYYY para tener el año con 4 dígitos
        if (YYYY.length<4) { YYYY =year.slice(0,2) + YYYY;}
        if (YY.length>2) { YY =YY.slice(-2);}
      }
      if (pattern[e].str != null && pattern[e].str.length == pattern[e].chr) {
        ly = (y % 4) == 0; //Da true si es un año bisiesto y false si no lo es.
      }
      if (pattern[e].str=='0000' || pattern[e].str=='00') {OK=false;}
      if (pattern[e].char == 'Y' && full && (pattern[e].str == null || pattern[e].str.length < pattern[e].chr)) {OK=false;}
    }             
    else if (pattern[e].char == 'm' || pattern[e].char == 'n') {
      // Meses ----------------
      if (ValueFormat && pattern[e].str == null) {pattern[e].str = month; }
      if (pattern[e].str != null) {
        if (pattern[e].str=='00') {OK=false;}
        m=pattern[e].str; M=m; MM=m; 
        // M es para tener el mes sin cero por delante y MM para tenerlo con cero por delante
        if (MM.length<2) { MM = '0' + MM;}
        if (M.indexOf('0',0)==0) { M = M.slice(-1);} 
        if (pattern[e].char == 'm' && ValueFormat) {pattern[e].str=MM;}
      }
      if (pattern[e].char == 'm' && full && (pattern[e].str == null || pattern[e].str.length < pattern[e].chr)) {OK=false;}
    }      
    else if (pattern[e].char == 'd' || pattern[e].char == 'j') {
      // Días ----------------
      if (ValueFormat && pattern[e].str == null) {pattern[e].str = today.getDay().toString();}
      if (pattern[e].str != null) {
        if (pattern[e].str=='00') {OK=false;}
        d=pattern[e].str; D=d; DD=d;
        // D es para tener el mes sin cero por delante y DD para tenerlo con cero por delante
        if (DD.length<2) { DD = '0' + DD;} 
        if (D.indexOf('0',0)==0) { D = D.slice(-1);}  
        if (pattern[e].char == 'd' && ValueFormat) {pattern[e].str=DD;}
      }
      if (pattern[e].char == 'd' && full && (pattern[e].str == null || pattern[e].str.length < pattern[e].chr)) {OK=false;}
    }       
    else if (pattern[e].char == 'H' || pattern[e].char == 'G') {
      // Horas ----------------
      if (ValueFormat && pattern[e].str == null) {pattern[e].str = today.getHours().toString();}
      if (pattern[e].str != null) {
        h = pattern[e].str; H = h; HH = h;  if (h>23) {OK=false;}
        // H es para tener la hora sin cero por delante y HH para tenerla con cero por delante
        if (HH.length<2) { HH = '0' + HH;}
        if (H.indexOf('0',0)==0) { H = H.slice(-1);} 
        if (pattern[e].char == 'H' && ValueFormat) {pattern[e].str=HH;}
      }
      if (pattern[e].char == 'H' && full && (pattern[e].str == null || pattern[e].str.length < pattern[e].chr)) {OK=false;}
    } 
    else if (pattern[e].char == 'i') {
      // Minutos ----------------
      if (ValueFormat && pattern[e].str == null) {pattern[e].str = today.getMinutes().toString(); }
      if (pattern[e].str != null) {
        i = pattern[e].str;  I = i;   if (i>59) {OK=false;} 
        if (I.length==1) {I = '0' + I;}
        if (ValueFormat) { pattern[e].str = I;} 
      }
      if (full && (pattern[e].str == null || pattern[e].str.length < pattern[e].chr)) {OK=false;}
    }
    else if (pattern[e].char == 's') {
      // Segundos ----------------
      if (ValueFormat && pattern[e].str == null) {pattern[e].str = today.getSeconds().toString();}
      if (pattern[e].str != null) {
        s = pattern[e].str;  S = s;   if (s>59) {OK=false;}
        if (S.length==1) {S = '0' + S;}
        if (ValueFormat) {pattern[e].str = S;}
      }
      if (full && (pattern[e].str == null || pattern[e].str.length < pattern[e].chr)) {OK=false;}
    } 
    else if (pattern[e].char == 'u') {
      // MicroSegundos -----------
      if (ValueFormat && pattern[e].str == null) {pattern[e].str = today.getMilliseconds().toString();}
      if (pattern[e].str != null) {
        u = pattern[e].str;  U = u;    if (u>999) {OK=false;}  
        if (U.length<3) {U = '00' + U; U = U.slice(-3);}
        if (ValueFormat) {pattern[e].str = U;}
      }
      if (full && (pattern[e].str == null || pattern[e].str.length < pattern[e].chr)) {OK=false;}
    }        
    else if (pattern[e].symbol) {
      // Simbolos separador --
      if (ValueFormat && pattern[e].str == null) {pattern[e].str = pattern[e].char;}
      if (full && pattern[e].char != pattern[e].str) {OK=false;}
    }
    if (full && pattern[e].str == null) {OK=false;}  
  }
  if (ValueFormat) {
    // Se toman valores de la Fecha y Hora actual para aquellos valores a cero
    // YY es para tener el año con 2 dígitos y YYYY para tener el año con 4 dígitos
    if (y==0) { YYYY =year; YY =year.slice(-2);}
    // M es para tener el mes sin cero por delante y MM para tenerlo con cero por delante
    if (m==0) { MM = month; M = month;  if (MM.length==1) {MM = '0' + MM;}}    
    // D es para tener el mes sin cero por delante y DD para tenerlo con cero por delante
    if (d==0) { DD = today.getDay().toString(); D = DD; if (DD.length==1) {DD = '0' + DD;}}   
    // H es para tener la hora sin cero por delante y HH para tenerla con cero por delante
    if (h==0) { HH = today.getHours().toString(); H=HH; if (HH.length==1) { HH = '0' + HH;}}   
    if (i==0) { I = today.getMinutes().toString();  if (I.length==1) { I = '0' + I;}}   
    if (s==0) { S = today.getSeconds().toString();  if (S.length==1) { S = '0' + S;}}   
    if (u==0) { U = today.getMilliseconds().toString(); if (U.length<3) {U = '00' + U; U =U.slice(-3);}}   
  }
  if (m>0 && d>0) {
    //Se comprueba que los meses tengan los días correspondientes
    if (m==4 || m==6 || m==9 || m==11) {
      if (d>30) {OK =false;}
    }
    else if (m==2) {
      if ((ly && d>29) || (!ly && d>28)) {OK = false;}
    }
    else if (m>12) {OK = false}
  }
  if (d>31) {OK = false;} 
  if (ValueFormat && OK) {
    // Crea un array con cada caracter que trae ValueFormat
    var arrayValue = ValueFormat.split('',ValueFormat.length);
    var Format = '';
    arrayValue.forEach(function(char) {
      switch (char) {
        case 'd': Format = Format + DD; break;
        case 'j': Format = Format + D; break;
        case 'm': Format = Format + MM; break;
        case 'n': Format = Format + M; break;
        case 'Y': Format = Format + YYYY; break;
        case 'y': Format = Format + YY; break;
        case 'H': Format = Format + HH; break;
        case 'G': Format = Format + H; break;
        case 'i': Format = Format + I; break;
        case 's': Format = Format + S; break;
        case 'u': Format = Format + U; break;
        case '/': Format = Format + char; break;
        case '-': Format = Format + char; break;
        case ':': Format = Format + char; break;
        case '.': Format = Format + char; break;
        case ' ': Format = Format + char; break;
        case 'T': Format = Format + char; break;
      }
    });
    return Format;
  }
  else {return OK;}
}

function ReplaceNumberOk (value) {
    //Como es un número se hacen los arreglos oportunos
    //Como quitar ceros por delante y detrás, cambiar la coma por el punto decimal
    var str = value.replace(',','.');
    var num_str = +str;
    var n_s = String(num_str);
    if (n_s != value || n_s != num_str) {
      value = num_str;
    }
    return value;
}

function FormatNumber (value, ValueFormat) {
  // Función para dar formato a números
  var arrayValue = value.split('.');
  var numberint = + arrayValue[0]; // Valor entero
  var negative = numberint < 0 ? true: false;
  if (negative) {numberint = Math.abs(numberint)} // Si el valor entero es negativo lo pasa a positivo
  var numberdecimal = '';   if (arrayValue.length>1) {numberdecimal = arrayValue[1]; } // Valor decimal si hubiese
  var ValueFormatInt = '', ValueFormatDec = '';
  var arrayValue = ValueFormat.split(DecimalPlaceholder);
  ValueFormatInt=arrayValue[0];  // Toma la parte entera de ValueFormat (a la izquierda del separador decimal)
  if (arrayValue.length==2) {
    ValueFormatDec=arrayValue[1]; // Toma la parte decimal de ValueFormat (a la derecha del separador decimal)
  } 
  else if (arrayValue.length>2) {
  }
  if (ValueFormatDec.length==0 && numberdecimal.length>0) {
    // La máscara de formato ValueFormat no tiene separador decimal y existe un valor decimal
    // Se redondea en ValueInt sin valor decimal 
    numberint = +value;
    numberint = Math.round(numberint);
  }
  if (ValueFormatDec.length>0) {
    // Ahora se comprueba si hay que redondear la parte decimal    
    var tdec = 0;
    // Se cuenta el total de decimales a devolver por si hay que redondear el valor decimal
    for (var i = 0; i < arrayValue.length; i++) {
      var char = ValueFormatDec.slice(i,i+1);
      if (char == '#' || char == '0') {tdec++;}
    }
    if (numberdecimal.length > tdec) {
      // El value trae más decimales de los que tiene la máscara de formato y se pasa a redondear a los decimales que pide la máscara de formato
      var div = '1' + '0'.repeat(numberdecimal.length - tdec);
      div = + div;
      numberdecimal = + numberdecimal; // Lo pasamos a variable numérica
      numberdecimal = Math.round(numberdecimal / div).toString();
      if (numberdecimal.length > tdec) {
        // El redondeo da como resultadoel el incremento de 1 en el numero entero  y dejar a cero el número decimal.
        numberdecimal = '';   numberint = numberint+1;
      }
    }
  }
  numberint = '' + numberint; // El valor entero se convierte en cadena para a continuación tratar sus digitos
  var Format = '', FormatInt = '', FormatDec = '';
  arrayValue = ValueFormatInt.split('',ValueFormatInt.length);
  var posc = numberint.length-1;
  for (var i = arrayValue.length-1; i>=0; i--) {
    // En este bucle se formatea el valor entero y se recorre de derecha a izquierda
    var char = arrayValue[i];
    var digito = '';
    if (posc>=0) {
      digito = numberint.slice(posc,posc+1);
    } else {
      if (posc==-1 && negative) {FormatInt = '-' + FormatInt; negative = false; } // Añade el simbolo de negativo
      if (char != '#' && char != ThousandsSeparator) {digito=char;}
    }
    switch (char) {
      case '0': FormatInt = digito + FormatInt; posc --; break;
      case '#': FormatInt = digito + FormatInt; posc --; break;
      case ThousandsSeparator: FormatInt = digito.length>0 ? char + FormatInt : FormatInt; break;
      default: FormatInt = char + FormatInt; break;
    }
  }
  if (ValueFormatDec.length>0) {
    // Ahora se da formato a la parte decimal    
    var Comma = false;
    arrayValue = ValueFormatDec.split('',ValueFormatDec.length);
    posc=0;    
    for (var i = 0; i < arrayValue.length; i++) {
      // En este bucle se formatea el valor decimal y se recorre de izquierda a derecha
      var char = arrayValue[i];
      var digito = '';
      if (posc<numberdecimal.length) {
        digito = numberdecimal.slice(posc,posc+1); Comma = true;
      } else {if (char == '0') {digito='0';}}
      switch (char) {
        case '0': FormatDec = FormatDec + digito; posc ++; Comma = true; break;
        case '#': FormatDec = FormatDec + digito; posc ++; break;
        default: FormatDec = FormatDec + char; break;
      }
    } 
  }
 
  Format=FormatInt;
  if (FormatDec.length>0) {Format = Format + (Comma ? DecimalPlaceholder:'') + FormatDec;}
  return Format;
}


document.addEventListener("input", (event) => { 
  var element = event.target;
  var maskinput = element.getAttribute('maskinput');  
  if (MasksInputList[maskinput] == undefined) {return;} 
  else {maskinput = maskinput.toUpperCase();} 
  if ((element.tagName === "INPUT" || element.tagName === "TEXTAREA") && maskinput) {  
    var modeInsert = element.selectionEnd+1 < element.value.length;
    if (element.value.length>0) {
      KeyInputOK=ControlRegExpMaskInput(maskinput, element.value, 'regexpinput', modeInsert);
      // Pone atributo MaskinputValueIsOK a false o true (Para poder personalizar los colores con CSS)
      element.setAttribute('MaskinputValueIsOK', KeyInputOK);      
      if (!MasksInputList[maskinput].modestrong && !LengthOver) {
        // ModeRegExpInput de la máscara de control no tiene activo el modo strong y se deja pasar lo tecleado mientras no supere la longitud
        KeyInputOK=true;
      }
    }
    else {KeyInputOK=true;} // Para cuando se deja el input sin valor alguno
    if (KeyInputOK) {
      // Toma el value validado para reponer en la próxima vez que no valide
      LastInputValOK=element.value;
      Lastposcursor_start = element.selectionStart;
      Lastposcursor_end = element.selectionEnd;       
      focusout=false;
      element.setAttribute('value2', element.value); 
    } 
    else {
      // Como value no ha validado se repone con el último value valido
      element.value=LastInputValOK;
      if (element.hasOwnProperty("selectionStart")) {
        element.selectionStart = Lastposcursor_start;
        element.selectionEnd = Lastposcursor_end;   
      }       
    }
  }
});


document.addEventListener("focusin", (event) => { 
  // Cuando se toma el foco se añade atributo MaskinputValueIsOK al input o textarea
  if (focusout) {return;}
  var element = event.target;
  var maskinput = element.getAttribute('maskinput');  
  if (MasksInputList[maskinput] == undefined) {return;} 
  else {maskinput = maskinput.toUpperCase();} 
  if ((element.tagName === "INPUT" || element.tagName === "TEXTAREA") && maskinput) {
    var MaskinputValueIsOK = element.getAttribute('MaskinputValueIsOK');
    if (MaskinputValueIsOK == undefined) {element.setAttribute('MaskinputValueIsOK', true);}
    if (element.getAttribute('value2') != undefined) {element.value = element.getAttribute('value2');}
    if (element.getAttribute('type2') != undefined) {element.type = element.getAttribute('type2');}
    LastInputValOK=element.value; // Toma el value para reponer en la próxima vez que no valide
  }
});


document.addEventListener("focusout", (event) => { 
    // Al perder el foco se comprueba regexpoutput y se da formato si está indicado
    var element = event.target;
    var maskinput = element.getAttribute('maskinput');  
    if (MasksInputList[maskinput] == undefined) {return;} 
    else {maskinput = maskinput.toUpperCase();} 
    if ((element.tagName === "INPUT" || element.tagName === "TEXTAREA") && maskinput) {
      if (element.value.length==0) {element.value = ''; element.setAttribute('value2',''); return;}     
      focusout = true;
      var OK = false;
      if (MasksInputList[maskinput].type == "number") {
        element.value=ReplaceNumberOk (element.value);
      } 
      if (MasksInputList[maskinput].regexpoutput && MasksInputList[maskinput].regexpoutput.length>0) {
        // Hay máscara de control a la salida y se comprueba
        OK=ControlRegExpMaskInput(maskinput,element.value,'regexpoutput',false, true);
      }
      else {
        // No hay máscara de control a la salida y si es datetime se pasa a recomprobar
        if (MasksInputList[maskinput].type == 'datetime') {
          OK=ControlRegExpMaskInput(maskinput,element.value,'regexpinput',false, false);
        }
        else {
          //Al no haber máscara de control a la salida se pone OK a true por si hay que dar formato
          OK = true;
        }
      }
      // Pone atributo MaskinputValueIsOK a false o true (Para poder personalizar los colores con CSS)           
      element.setAttribute('MaskinputValueIsOK', OK); 
      focusout=false;
      if (OK) { 
        if (MasksInputList[maskinput].type == 'datetime') {
          if (MasksInputList[maskinput].filldatetimevalue2 && MasksInputList[maskinput].filldatetimevalue2.length>0) {
            // Rellena value2 con el pattern validado por si no se ha tecleado toda los dígitos de datetime
            var Format = DateIsOkPatternDateTime (OkTestPattern,true,MasksInputList[maskinput].filldatetimevalue2);
            if (Format) {element.setAttribute('value2', Format);}
          }
        }
        // Se comprueba si hay que dar formato y/o reemplazo de caracteres
        if (MasksInputList[maskinput].valueformat && MasksInputList[maskinput].valueformat.length>0) {
          //Hay que dar formato y se pasa el value a value2 del input o textarea y el tipo de input se pasa a type2 y se convierte en tipo text
          if (element.getAttribute('type') != 'text') {
            element.setAttribute('type2', element.type);  element.type = 'text';
          }
          var valformat = MasksInputList[maskinput].valueformat;
          if (valformat.indexOf("<[")>0 && valformat.indexOf("]>")>0) {
            // Es una expresión regular con reemplazo de caracteres separadas por <[ ... ]>
            var ExpRegFormat = null, ArrayFormat = null, StringFormat = null;
            valformat = valformat.slice(0,valformat.length-2);
            const FormatRegExpArray = valformat.split("<[");
            FormatRegExpArray.forEach(function(elem) {
              elem = elem.trim(); //Quita los espacios del principio y del final
              if (elem.indexOf("/")==0) {
                // Es una Expresión Regular y quita las barras de inicio y final de RegExp y separa los caracteres flags
                if (elem.indexOf("/")>-1) {
                  elem = elem.substring(elem.indexOf("/")+1);
                }
                if (elem.lastIndexOf("/")>0) {
                  var flags = elem.substring(elem.lastIndexOf("/")+1);
                  elem = elem.substring(0,elem.lastIndexOf("/"));
                }
                ExpRegFormat = new RegExp(elem,flags);
              }  
              else if (elem.indexOf("{")==0 && elem.indexOf("}")==elem.length-1) {
                ArrayFormat=JSON.parse(elem);                 
              } 
              else {StringFormat=elem;}             
            });
            if (typeof(ExpRegFormat) == 'object'  && ExpRegFormat != null) {
              if (typeof(ArrayFormat) == 'object' && ArrayFormat != null) {
                // La otra parte es un array de sustitución
                element.value=element.value.replace(ExpRegFormat,function(e){
                    if (e.length>1) {e=e.toLowerCase();}
                    return ArrayFormat[e];
                });  
              }
              else if (typeof(StringFormat) == 'string') {
                // La otra parte es una cadena de sustitución
                element.value=element.value.replace(ExpRegFormat, StringFormat);
              }
            }
          }
          else {
            // ValueFormat no tiene una Expresión Regular y se comprueba que tipo de Formato hay que dar
            if (MasksInputList[maskinput].type == 'number' || MasksInputList[maskinput].type == 'code') {
              // Da Formato Numérico
              element.value = FormatNumber(element.value,MasksInputList[maskinput].valueformat);
            }
            else if (MasksInputList[maskinput].type == 'datetime') {           
              // Da formato Datetime
              if (OkTestDate) {
                // Después se da formato a value con el patrón de ValueFormat
                var Format = DateIsOkPatternDateTime (OkTestPattern,true,MasksInputList[maskinput].valueformat);
                if (Format) {element.value = Format;} else {OK=false;}
              }
              else {OK=OkTestDate;}
            } 
          }
        }          
      }   
      if (!OK) {
        // No pasa la Expresión Regular y se vuelve el foco al campo input o textarea        
        element.value=LastInputValOK;
        // Pone atributo MaskinputValueIsOK a false o true (Para poder personalizar los colores con CSS)           
        element.setAttribute('MaskinputValueIsOK', OK);         
        if (SelectAllValueNotOK) {element.select();}
        element.focus();
      } 
    }
});    

