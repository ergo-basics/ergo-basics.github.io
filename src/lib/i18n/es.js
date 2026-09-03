import en from './en.js';

export default {
	...en,
	common: { ...en.common, toTop: '↑ Arriba', backToTop: 'Volver arriba', languageLabel: 'Idioma', switchLanguage: 'Cambiar idioma' },
	theme: { toLight: 'Cambiar al tema claro', toDark: 'Cambiar al tema oscuro', toggle: 'Cambiar tema' },
	topbar: { nav: 'Secciones de Ergo', links: { technology: { label: 'Tecnología', short: 'Tecnología' }, economics: { label: 'Economía', short: 'Economía' }, applications: { label: 'Aplicaciones', short: 'Apps' }, mission: { label: 'Misión', short: 'Misión' } } },
		home: {
		...en.home,
		hero: { eyebrow: 'Dinero programable, construido desde primeros principios', title: 'Ergo es una blockchain para el dinero contractual.', body: 'Seguridad inspirada en Bitcoin, contratos eUTXO expresivos y pruebas que preservan la privacidad: diseñada para unas finanzas útiles sin intermediarios de confianza.', primary: 'Entender la tecnología', secondary: 'Explorar el ecosistema', note: 'Prueba de trabajo · 1 de julio de 2019 · sin ICO · sin asignación a capital riesgo' },
		foundations: { eyebrow: 'Los fundamentos', title: 'Consenso conservador. Contratos modernos.', intro: 'Ergo parte de las ideas contrastadas de UTXO y prueba de trabajo, y las amplía sin convertir la validación en cómputo sin límites.', cards: [
			{ title: 'UTXO extendido', text: 'El estado vive en cajas discretas, no en una cuenta global. Cada transacción declara qué cajas consume: las dependencias son explícitas y la validación local es predecible.' },
			{ title: 'ErgoScript', text: 'Lenguaje tipado y determinista para condiciones de gasto. Cada script está acotado; los contratos multietapa expresan procesos prolongados mediante transacciones auditables.' },
			{ title: 'Autolykos v2', text: 'Prueba de trabajo intensiva en memoria y pensada para GPU de consumo. v2 abandonó la resistencia original a pools cuando los contratos hicieron impracticable ese objetivo.' }
		] },
		boxes: { eyebrow: 'El modelo eUTXO', title: 'Una caja puede contener valor, tokens, datos y lógica.', intro: 'Cada salida no gastada es una caja Ergo. R0–R3 contienen valor, script, tokens y metadatos de creación; R4–R9 almacenan datos tipados.', points: [
			{ n: '01', title: 'Activos nativos', text: 'Los tokens son contenidos de primer nivel, no saldos mantenidos por otro contrato.' },
			{ n: '02', title: 'Entradas de datos', text: 'Una transacción lee una caja sin consumirla. Muchas operaciones consultan el mismo oráculo sin competir por gastarlo.' },
			{ n: '03', title: 'Razonamiento local', text: 'El contrato valida entradas, salidas y contexto declarados. Las cajas independientes permiten concurrencia; una caja compartida aún puede crear contención.' },
			{ n: '04', title: 'Cómputo fuera de cadena', text: 'El usuario construye la transacción fuera de cadena y los mineros verifican una prueba finita.' }
		] },
		proofs: { ...en.home.proofs, eyebrow: 'Autorización programable', title: 'Demuestra la condición; revela solo lo necesario.', intro: 'ErgoScript compone proposiciones Sigma mediante AND, OR y umbrales. Permite multifirma, autorización tipo anillo y protocolos de conocimiento cero.', quote: 'Un script no es una máquina virtual sin límites: la expresividad surge entre transacciones y cada validación sigue siendo finita.' },
		sustainability: { ...en.home.sustainability, eyebrow: 'Diseño a largo plazo', title: 'El estado inactivo paga por ocupar el registro.', intro: 'Una caja sin tocar durante cuatro años puede pagar alquiler de almacenamiento. Con los parámetros actuales son aproximadamente 0,14 ERG por cuatro años para una caja típica, según su tamaño.' },
		economics: { ...en.home.economics, eyebrow: 'Economía', title: 'Una oferta conocida, distribuida mediante minería.', intro: 'Mainnet arrancó el 1 de julio de 2019. ERG no tuvo ICO ni asignación a capital riesgo; la Fundación recibe el 4,43 % de la emisión mediante un contrato transparente.', body: 'Babel Fees permite obtener atómicamente el ERG de la comisión desde una caja de liquidez pagando al proveedor con otro token. La comisión del protocolo sigue pagándose en ERG.' },
		applications: { ...en.home.applications, eyebrow: 'Aplicaciones', title: 'Primitivas financieras que ya funcionan en cadena.', intro: 'El diseño de Ergo se materializa en sistemas desplegados. Cada aplicación conserva sus propios riesgos de contratos, liquidez y puentes.' },
		community: { ...en.home.community, eyebrow: 'Desde ErgoForum', title: 'Un laboratorio de economía programable.', intro: 'La comunidad investiga sus diseños en público. Son debates y propuestas, no afirmaciones de que cada sistema esté desplegado.' },
		mission: { ...en.home.mission, eyebrow: 'Por qué existe Ergo', title: 'Herramientas para quienes están en los márgenes del sistema financiero.', body: 'El manifiesto de Ergo defiende contratos financieros abiertos y resistentes a la censura, privacidad cuando sea necesaria y valor controlado por sus usuarios. No pretende poner todo en una blockchain: busca dinero contractual robusto.' },
		sources: { ...en.home.sources, eyebrow: 'Verifica, no confíes', title: 'Fuentes primarias', body: 'Esta web separa hechos del protocolo y afirmaciones del ecosistema. Empieza por la especificación y las propuestas de mejora; la disponibilidad puede cambiar.' }
	}
};
