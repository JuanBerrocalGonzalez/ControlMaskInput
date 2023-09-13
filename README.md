# ControlMaskInput
Control de entrada de datos en los inputs <input type="text", "number", "tel", "url", "email", "password", "date", "time", "datetime-local" o textarea 

ControlMaskInput v1.52 by Juan Berrocal González
Copyright 2023 - The ControlMaskInput Author (https://github.com/JuanBerrocalGonzalez)

Archivos:
js/controlmaskinput.js                      incluir entre las etiquetas <head>... <script src="js/controlmaskinput.js"></script> ...</head>
css/controlmaskinput.css                    (opcional -> puedes crear tus hojas de estilos)
js/MasksInputList/MasksInputConfig.ini      Archivo INI de Configuración general
js/MasksInputList/MasksInputList_ES.ini     Archivo INI de Configuración de máscaras de control 


Para que actue este control, los elementos <input> o <textarea> deben contener el atributo maskinput="..."
Ejemplo: <input type="text" class="..." maskinput="MONEY" name="...">
         <textarea class="..." maskinput="EMAILS" name="..."></textarea>

Podemos controlar que el valor de un input sea del tipo moneda, precio, descuento, margen, fecha, código postal, email, etc..
Algunas de las máscaras a incluir entre comillas en el atributo maskinput son: AMOUNT, CODE, MONEY, PRICE, EMAIL, DATETIME, etc..

Estas máscaras se pueden definir en el archivo MasksInputList_ES.ini ubicado en js/MasksInputList
Cambiando en este archivo el parámetro MasksInputCountry = 'ES'puedes crear diferentes archivos INI para otros paises.
por defecto esta con ES para España 

Hay dos métodos de control: 1º En el justo momento de la introducción de datos con el tecleo, mediante 'regexpinput'
                            2º Cuando el Input o Textarea pierde el foco, mediante 'regexpoutput'
                            Puedes usar la primera, la segunda o ambas. Para que una no actue, la etiqueta debe estar sin valor.

Con ValueFormat puedes dar formato al valor del input o textarea cuando este pierde el foco.
Al input/textarea se le creará la propiedad value2 que contendrá el valor sin formato, el cual se mostrará nuevamente al coger el foco.

Con CSS puedes cambiar las propiedades los elementos input y textarea, por ejemplo:
   input[maskinput] {...} ,  input[maskinput="AMOUNT"] {...} ,  textarea[maskinput="EMAIL"] {...} , etc..

o cambiar las propiedades según el valor sea válido o no lo sea, por ejemplo:
   input[MaskinputValueIsOK=true] {background-color:#ffffff...} ,  input[MaskinputValueIsOK=false] {background-color:#feebeb...}

---------------------------------------------------------------------------------------------------------------------------------------------------
js/MasksInputList/MasksInputConfig.ini      Archivo INI de Configuración general
---------------------------------------------------------------------------------------------------------------------------------------------------
Con MasksInputCountry puedes crear otros archivos de máscaras de control para otros paises.

Con ModeRegExpInputDefault puedes elegir entre dos opciones:
light ->  para que al teclear en el input o textarea deje pasar caracteres no válidos y que solamente afecte al estilo del input o textarea.
          El estilo se cambia con las hojas de estilos CSS. Ejemplos en el archivo css/controlmaskinput.css
          Con input[MaskinputValueIsOK=true] o input[MaskinputValueIsOK=false] o textarea[MaskinputValueIsOK=true] o textarea[MaskinputValueIsOK=false],
          puedes cambiar el color de fondo, etc.., cuando se cumple la máscara de control es true y false cuando no se cumple.
           
strong -> para que al teclear en el input o textarea no deje pasar caracteres no válidos y ademas afecta al estilo del input o textarea como
          se describe en el párrafo anterior.
light o strong se puede asignar individualmente en cada máscara de control en el parámetro ModeRegExpInput = xxxxx
Si ModeRegExpInput no esta definida o el valor no es válido, se toma ModeRegExpInputDefault para esa máscara de control.

Con SelectAllValueNotOK a true hace que al perder el foco aquellos inputs o textarea que no validen bien, estos quedan con todo el texto seleccionado

Con ReplaceCommaNumbers a true hace que al validar los números que tengan una coma en el lugar del punto decimal, esta coma se cambie por un punto.

---------------------------------------------------------------------------------------------------------------------------------------------------
Archivo js/MasksInputList/MasksInputList_ES.ini     Archivo INI de Configuración de máscaras de control
---------------------------------------------------------------------------------------------------------------------------------------------------
[Nombre de la máscara] 
type = number, code, text, datetime    
     '--> number numeros + punto y coma. Quita los ceros a la izquierda y a la derecha
     '--> code  numeros + punto y coma.
     '--> text  cualquier carácter alfanumérico.
     '--> datetime comprueba que la fecha y hora sea correcta.

ModeRegExpInput = light, strong   <--(Es opcional)
             
   light -->  para que al teclear en el input o textarea deje pasar caracteres no válidos y que solamente afecte al estilo del input o textarea.
              El estilo se cambia con las hojas de estilos CSS. Ejemplos en el archivo css/controlmaskinput.css <--(Este archivo CSS es opcional, puedes hacerlo en tus hojas CSS)
              Con input[MaskinputValueIsOK=true] o input[MaskinputValueIsOK=false] o textarea[MaskinputValueIsOK=true] o textarea[MaskinputValueIsOK=false],
              puedes cambiar el color de fondo, etc.., cuando se cumple la máscara de control es true y false cuando no se cumple.
              
   strong --> para que al teclear en el input o textarea no deje pasar caracteres no válidos y ademas afecta al estilo del input o textarea como
              se describe en el párrafo anterior.

   light o strong se puede asignar individualmente en cada máscara de control en el parámetro ModeRegExpInput = xxxxx
   Si ModeRegExpInput no esta definida o el valor no es válido, se toma ModeRegExpInputDefault para esa máscara de control <--(en archivo de configuración MasksInputConfig.ini)
   
   
RegExpInput = /^...cadena con patrón de control de datos cuando se teclea...$/flags <--(flags es opcional)
            '-->Puedes crear más de una cadena separandola con dos barras ||
             Ejemplo: /^cadena1..$/flags || /^cadena2..$/flags || /^cadena3..$/flags  etc...
             Valida en cuanto una de las cadenas con patrón de control se cumpla
             Si RegExpInput no está definido el input o textarea aceptará cualquier carácter y puedes validar con RegExpOutput

             Con 'RegExpInput' en las Expresiones Regulares debes tener en cuenta que debes aceptar la expresión regular tal como se va introduciendo. 
             Por ejemplo un código de tres dígitos: Así es válido --> /^[0-9]{1,3}$/ permite de 1 a 3 dígitos. 
             Pero NO así --> /^[0-9]{3}$/ porque no se puede teclear tres dígitos a la vez, salvo que des a pegar.

length: Longitud de la cadena <--(Es opcional)

RegExpOutput = /^...cadena con patrón de control de datos para validar cuando el input o textarea pierde el foco...$/flags <--(flags es opcional) 
             '-->Puedes crear más de una cadena separandola con dos barras || al igual que se explica en RegExpInput
             Si RegExpOutput no está definido el input o textarea no realizará validación al perder el foco.

ValueFormat= Da formato al valor del input o textarea cuando pierde el foco.
             Al input/textarea se le creará la propiedad value2 que contendrá el valor sin formato.

             Para Formatos number o code puedes usar los siguientes caracteres de parámetros              
             0	Muestra un dígito o un cero.
             #	Muestra un dígito o nada. 
             ,  	Marcador de posición decimal. --> Puedes cambiarlo en DecimalPlaceholder de MasksInputConfig.ini
             .  	Separador de miles.           --> Puedes cambiarlo en ThousandsSeparator de MasksInputConfig.ini
             %    Se inserta en la posición en la que aparece en ValueFormat.
     €, $, etc.   Se inserta en la posición en la que aparece en ValueFormat.

             También puedes usar expresiones regulares para dar formato o reemplazar caracteres o palabras
             Ejemplo1: /(\+\d{3})?(\d{3})(\d{3})(\d{3})/ <[$1 $2 $3 $4]>  
                       '--> Da formato a un número de teléfono separandolos con espacios en 4 bloques 
                       El primer argumento es la Expresión Regular separadas por las barras / ... /
                       El segundo argumento son los resultados de cada bloque entre paréntesis ( ... )  de la Expresión Regular
                       El segundo argumento debe estar entre estos simbolos <[ ... ]>

             Ejemplo2: /Feo|Tonto|Inutil|Borde|Triste/ig <[{"feo":"Guapo", "tonto":"Listo", "inutil":"Genio", "borde":"Simpático", "triste":"Alegre"}]>
                       '--> Reemplaza unas palabras por otras.
                       El primer argumento es la Expresión Regular separadas por las barras / ... /
                       El segundo argumento es un array "Palabra1":"Reemplazo1", "Palabra2":"Reemplazo2", etc.. 
                       El segundo argumento debe estar entre estos simbolos <[{ ... }]>

---------------------------------------------------------------------------------------------------------------------------------------------------
Para la cadena de patrón de control y formato de DATETIME puedes usar los siguientes caracteres de parámetros:
---------------------------------------------------------------------------------------------------------------------------------------------------
    d – Día del mes de 01 al 31.
    j – Día del mes sin 0 para los números inferiores a 10, del 1 to 31.
    m – Número de mes de 01 a 12.
    n – Número de mes sin 0, del 1 al 12.
    Y – Año en 4 dígitos.
    y – Año en 2 dígitos.
    H – Hora con formato de 00 a 23.
    G - Hora sin 0, con formato de 0 a 23.
    i – Minutos de 00 a 59.
    s – Segundos de 00 a 59. 
    u – Microsegundos de 000 a 999.
    / - Separador Día/Mes/Año  <-- u otros caracteres como: - . o espacio
    : - Separador Minutos:Segundos
    . - Separador de Microsegundos  
    space - Separador entre date y time
    T - Separador entre date y time
    Ejemplo: la máscara d/m/Y valida de la siguiente manera:
             una fecha con el día 01 al 31, un separador /, el mes 01 al 12, otro separador / y el año del 0001 al 9999
             la máscara dmY valida igual pero no lleva los separadores
 
    NOTA: No los caracteres sin cero delante como j,n y G deberan usarse con separadores. j/n/Y  no es válido -> jnY   (...de momento)
          Se pueden incluir varias máscaras separadas por ||
          Ejemplo: RegExpInput=d/m/Y || dmY || d/m/Y H:i    <----(Si alguna es validada se dará por buena)

ValueFormat dará formato a la fecha y hora si se cumple RegExpOutput.
Si no se indica RegExpOutput, ValueFormat añadirá de la fecha y hora actual del sistema el resto de valores no introducidos.

FillDateTimeValue2 Rellena Value2 con la máscara indicada. 
Es opcional y sirve para aquellos casos en que no se termina de teclear todo los dígitos de datetime y así cuando vuelve a coger el foco
el input mostrará los datos conforme a la máscara dada en FillDateTimeValue2
---------------------------------------------------------------------------------------------------------------------------------------------------
