<?php
//
// ControlMaskInput v1.52 by Juan Berrocal González
// Copyright 2023 - The ControlMaskInput Author (https://github.com/JuanBerrocalGonzalez)
//
// Control de entrada de datos en los inputs <input type="text", "number", "tel", "url", "email", "password", "date", "time", "datetime-local" o textarea 
//

function GetParameterIni($parameter,$file = "js/MasksInputList/MasksInputConfig.ini ") {	 
    //Esta funcion lee del archivo DE CONFIGURACIÓN GENERAL y devuelve el valor del parámetro indicado en $parameter
    //Puede devolver un Array o el valor del parametro indicado.
    if (file_exists($file)) {
        //Pasa todo el archivo a un array
        $TheArray = parse_ini_file($file, true, INI_SCANNER_RAW );	
        //Recorro el array para buscar y tomar los valores a devolver
        foreach($TheArray as $key=>$value){
            if ($key == $parameter) {return $value;}
        }	
    }
}
$version = GetParameterIni('Version');

?>

<!doctype html>
<html lang="es">
    <head>
        <meta charset="UTF-8" name="viewport" content="width=device-width, initial-scale=1">
        <title>Mi pagina de pruebas Control Input</title>
        <script src="js/controlmaskinput.js?version=<?php echo $version;?>"></script>
        <link rel="stylesheet" href="css/controlmaskinput.css?version=<?php echo $version;?>" type="text/css" media="screen">
    </head>
    <body>
        <div class="readme">
        <span><p><b>
            ControlMaskInput v1.50 by Juan Berrocal González.<br />
            Copyright 2023 - The ControlMaskInput Author (https://github.com/JuanBerrocalGonzalez).</b><br />
            <br />
            Control de entrada de datos en los inputs input type="text", "number", "tel", "url", "email", "password", "date", "time", "datetime-local" o textarea. 
            <br /><br />
            <u>Archivos:</u><br />
            js/controlmaskinput.js                      incluir entre las etiquetas &lt;head&gt;... &lt;script src="js/controlmaskinput.js"&gt;&lt;/script&gt; ...&lt;/head&gt;
            <br />
            <b>css/controlmaskinput.css</b>                    Opcional -> puedes crear tus hojas de estilos. Este sirve de ejemplos.<br />
            <b>js/MasksInputList/MasksInputConfig.ini</b>      Archivo INI de Configuración general (Contiene texto de ayuda).<br />
            <b>js/MasksInputList/MasksInputList_ES.ini</b>     Archivo INI de Configuración de máscaras de control (Contiene texto de ayuda).<br />
            <br />
            Con el parámetro MasksInputCountry del archivo de configuración general, puedes crear otros archivos de máscaras de control para otros paises, por defecto esta con ES para España. <br />
            <br />
            Los campos que están a continuación sirven de ejemplo del uso de la máscaras de control.<br />
            En el archivo de configuración de máscaras de control, puedes crear nuevas o modificar las existentes.</span><br /><br />            
        </p></span>
        </div>
        <div id="controlmaskinput">
            <span>Campos númericos con entrada de texto strong y formato al perder foco. Pueden ser de type="number" o type="text"</span><br />
            <input type="number" placeholder="AMOUNT" maskinput="AMOUNT" step="any" >    
            <input type="number" placeholder="PRICE" maskinput="PRICE" step="any" >
            <input type="number" placeholder="MONEY" maskinput="MONEY" step="any" >
            <input type="number" placeholder="DISCOUNT" maskinput="DISCOUNT" step="any" >
            <input type="number" placeholder="MARGIN" maskinput="MARGIN">
            <input type="number" placeholder="CODE1" maskinput="CODE1">
            <input type="number" placeholder="CODE2" maskinput="CODE2">
            <input type="number" placeholder="CODE3" maskinput="CODE3">
            <input type="number" placeholder="CODE4" maskinput="CODE4">
            <input type="number" placeholder="CODE5" maskinput="CODE5">
            <input type="number" placeholder="CODE10M" maskinput="CODE10M">
            <input type="text" placeholder="CODE20M" maskinput="CODE20M">
            <input type="text" placeholder="CODE10M-20M" maskinput="CODE10M-20M">
            <input type="text" placeholder="POSTALCODE" maskinput="POSTALCODE">
            <br />
            <span>EMAIL Correo electronico con entrada de texto strong</span><br />
            <input type="email" placeholder="EMAIL" maskinput="EMAIL">
            <br />
            <span>URL Dirección página web con entrada de texto strong</span><br />
            <input type="url" placeholder="URL" maskinput="URL">
            <br />
            <span>Campo para entrada de telefono con o sin código internacional, entrada strong y formato al perder foco. Pueden ser de type="tel" o type="text"</span><br />
            <input type="tel" placeholder="PHONE" maskinput="PHONE">
            <span>Campo para entrada de DNI/NIE/CIF entrada strong y CIF da formato al perder foco.</span><br />
            <input type="text" placeholder="NIF/NIE" maskinput="NIF/NIE">
            <input type="text" placeholder="CIF" maskinput="CIF">
            <input type="text" placeholder="NIF/NIE/CIF" maskinput="NIF/NIE/CIF">
            <br />
            <span>Campo para entrada de Password entrada light. Debe incluir número, mayúscula, minúscula y simbolo, con 8 caracteres o más. Debe ser de type="password"</span><br />
            <input type="password" placeholder="PASSWORD" maskinput="PASSWORD"> 
            <br />            
            <span>Campo para entrada de FECHA y /o HORA da formato al perder foco. Son type="date", type="datetime-local" y type="time"</span><br />
            <input type="date" maskinput="DATE-HTML">
            <input type="datetime-local" maskinput="DATETIME-HTML">
            <input type="time" maskinput="TIME-HTML">
            <br />
            <span>Campo para entrada de FECHA y /o HORA entrada strong y da formato al perder foco. Son de type="text"</span><br />
            <input type="text" placeholder="DATE" maskinput="DATE">
            <input type="text" placeholder="DATETIME" maskinput="DATETIME">
            <input type="text" placeholder="TIME" maskinput="TIME">    
            <br />
            <span>EMAILS Varios emails separados por punto y coma o coma (Entrada light)</span><br />
            <textarea placeholder="EMAILS" max="100" maskinput="EMAILS"></textarea>  
            <br />
            <span>TEXT quita los acentos a las vocales acentuadas</span><br />
            <textarea placeholder="TEXT" maskinput="TEXT"></textarea>   
            <br />
            <span>LABELS reemplaza unas palabras por otras. Ejemplo: Feo|Tonto|Inutil|Borde|Triste por Guapo|Listo|Genio|Simpático|Alegre</span><br />
            <textarea placeholder="LABELS" maskinput="LABELS"></textarea>  
        </div>
    </body>
</html>
