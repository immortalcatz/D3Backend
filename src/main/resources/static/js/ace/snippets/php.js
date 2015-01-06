ace.define("ace/snippets/php", ["require", "exports", "module"], function (e, t, n)
{
    "use strict";
    t.snippetText = "snippet <?\n	<?php\n\n	${1}\nsnippet ec\n	echo ${1};\nsnippet <?e\n	<?php echo ${1} ?>\n# this one is for php5.4\nsnippet <?=\n	<?=${1}?>\nsnippet ns\n	namespace ${1:Foo\\Bar\\Baz};\n	${2}\nsnippet use\n	use ${1:Foo\\Bar\\Baz};\n	${2}\nsnippet c\n	${1:abstract }class ${2:$FILENAME}\n	{\n		${3}\n	}\nsnippet i\n	interface ${1:$FILENAME}\n	{\n		${2}\n	}\nsnippet t.\n	$this->${1}\nsnippet f\n	function ${1:foo}(${2:array }${3:$bar})\n	{\n		${4}\n	}\n# method\nsnippet m\n	${1:abstract }${2:protected}${3: static} function ${4:foo}(${5:array }${6:$bar})\n	{\n		${7}\n	}\n# setter method\nsnippet sm \n	${5:public} function set${6:$2}(${7:$2 }$$1)\n	{\n		$this->${8:$1} = $$1;\n		return $this;\n	}${9}\n# getter method\nsnippet gm\n	${3:public} function get${4:$2}()\n	{\n		return $this->${5:$1};\n	}${6}\n#setter\nsnippet $s\n	${1:$foo}->set${2:Bar}(${3});\n#getter\nsnippet $g\n	${1:$foo}->get${2:Bar}();\n\n# Tertiary conditional\nsnippet =?:\n	$${1:foo} = ${2:true} ? ${3:a} : ${4};\nsnippet ?:\n	${1:true} ? ${2:a} : ${3}\n\nsnippet C\n	$_COOKIE['${1:variable}']${2}\nsnippet E\n	$_ENV['${1:variable}']${2}\nsnippet F\n	$_FILES['${1:variable}']${2}\nsnippet G\n	$_GET['${1:variable}']${2}\nsnippet P\n	$_POST['${1:variable}']${2}\nsnippet R\n	$_REQUEST['${1:variable}']${2}\nsnippet S\n	$_SERVER['${1:variable}']${2}\nsnippet SS\n	$_SESSION['${1:variable}']${2}\n	\n# the following are old ones\nsnippet inc\n	include '${1:file}';${2}\nsnippet inc1\n	include_once '${1:file}';${2}\nsnippet req\n	require '${1:file}';${2}\nsnippet req1\n	require_once '${1:file}';${2}\n# Start Docblock\nsnippet /*\n# Class - post doc\nsnippet doc_cp${5}\n# Class Variable - post doc\nsnippet doc_vp${3}\n# Class Variable\nsnippet doc_v\n	${1:var} $${2};${5}\n# Class\nsnippet doc_c\n	${1:}class ${2:}\n	{\n		${7}\n	} // END $1class $2\n# Constant Definition - post doc\nsnippet doc_dp${2}\n# Constant Definition\nsnippet doc_d\n	ace.define(${1}, ${2});${4}\n# Function - post doc\nsnippet doc_fp${4}\n# Function signature\nsnippet doc_s\n	${1}function ${2}(${3});${7}\n# Function\nsnippet doc_f\n	${1}function ${2}(${3})\n	{${7}\n	}\n# Header\nsnippet doc_h\n	\n# Interface\nsnippet interface\n	interface ${1:$FILENAME}\n	{\n		${5}\n	}\n# class ...\nsnippet class\n	class ${2:$FILENAME}\n	{\n		${3}\n		${5:public} function ${6:__construct}(${7:argument})\n		{\n			${8:// code...}\n		}\n	}\n# ace.define(...)\nsnippet def\n	ace.define('${1}'${2});${3}\n# defined(...)\nsnippet def?\n	${1}defined('${2}')${3}\nsnippet wh\n	while (${1:/* condition */}) {\n		${2:// code...}\n	}\n# do ... while\nsnippet do\n	do {\n		${2:// code... }\n	} while (${1:/* condition */});\nsnippet if\n	if (${1:/* condition */}) {\n		${2:// code...}\n	}\nsnippet ifil\n	<?php if (${1:/* condition */}): ?>\n		${2:<!-- code... -->}\n	<?php endif; ?>\nsnippet ife\n	if (${1:/* condition */}) {\n		${2:// code...}\n	} else {\n		${3:// code...}\n	}\n	${4}\nsnippet ifeil\n	<?php if (${1:/* condition */}): ?>\n		${2:<!-- html... -->}\n	<?php else: ?>\n		${3:<!-- html... -->}\n	<?php endif; ?>\n	${4}\nsnippet else\n	else {\n		${1:// code...}\n	}\nsnippet elseif\n	elseif (${1:/* condition */}) {\n		${2:// code...}\n	}\nsnippet switch\n	switch ($${1:variable}) {\n		case '${2:value}':\n			${3:// code...}\n			break;\n		${5}\n		default:\n			${4:// code...}\n			break;\n	}\nsnippet case\n	case '${1:value}':\n		${2:// code...}\n		break;${3}\nsnippet for\n	for ($${2:i} = 0; $$2 < ${1:count}; $$2${3:++}) {\n		${4: // code...}\n	}\nsnippet foreach\n	foreach ($${1:variable} as $${2:value}) {\n		${3:// code...}\n	}\nsnippet foreachil\n	<?php foreach ($${1:variable} as $${2:value}): ?>\n		${3:<!-- html... -->}\n	<?php endforeach; ?>\nsnippet foreachk\n	foreach ($${1:variable} as $${2:key} => $${3:value}) {\n		${4:// code...}\n	}\nsnippet foreachkil\n	<?php foreach ($${1:variable} as $${2:key} => $${3:value}): ?>\n		${4:<!-- html... -->}\n	<?php endforeach; ?>\n# $... = array (...)\nsnippet array\n	$${1:arrayName} = array('${2}' => ${3});${4}\nsnippet try\n	try {\n		${2}\n	} catch (${1:Exception} $e) {\n	}\n# lambda with closure\nsnippet lambda\n	${1:static }function (${2:args}) use (${3:&$x, $y /*put vars in scope (closure) */}) {\n		${4}\n	};\n# pre_dump();\nsnippet pd\n	echo '<pre>'; var_dump(${1}); echo '</pre>';\n# pre_dump(); die();\nsnippet pdd\n	echo '<pre>'; var_dump(${1}); echo '</pre>'; die(${2:});\nsnippet vd\n	var_dump(${1});\nsnippet vdd\n	var_dump(${1}); die(${2:});\nsnippet http_redirect\n	header (\"HTTP/1.1 301 Moved Permanently\"); \n	header (\"Location: \".URL); \n	exit();\n# Getters & Setters\nsnippet gs\n	public function get${3:$2}()\n	{\n		return $this->${4:$1};\n	}\n	public function set$3(${7:$2 }$$1)\n	{\n		$this->$4 = $$1;\n		return $this;\n	}${8}\n# anotation, get, and set, useful for doctrine\nsnippet ags\n	${2:protected} $${3:foo};\n\n	public function get${4:$3}()\n	{\n		return $this->$3;\n	}\n\n	public function set$4(${5:$4 }$${6:$3})\n	{\n		$this->$3 = $$6;\n		return $this;\n	}\nsnippet rett\n	return true;\nsnippet retf\n	return false;\n", t.scope = "php"
});