import en from './en.js';

export default {
	...en,
	common: { ...en.common, toTop: '↑ Arriba', backToTop: 'Volver arriba', visit: 'Visitar', languageLabel: 'Idioma', switchLanguage: 'Cambiar idioma' },
	theme: { toLight: 'Cambiar al tema claro', toDark: 'Cambiar al tema oscuro', toggle: 'Cambiar tema' },
	topbar: { nav: 'Secciones de Ergo', links: { technology: { label: 'Tecnología', short: 'Tecnología' }, economics: { label: 'Economía', short: 'Economía' }, applications: { label: 'Aplicaciones', short: 'Apps' }, mission: { label: 'Misión', short: 'Misión' } } },
		home: {
		...en.home,
		meta: { title: 'Ergo Basics — Dinero contractual', description: 'Una introducción visual y documentada a Ergo: eUTXO, ErgoScript, protocolos Sigma, alquiler de almacenamiento y su ecosistema financiero.' },
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
		proofs: { ...en.home.proofs, eyebrow: 'Autorización programable', title: 'Demuestra la condición; revela solo lo necesario.', intro: 'ErgoScript compone proposiciones Sigma mediante AND, OR y umbrales. Permite multifirma, autorización tipo anillo y protocolos de conocimiento cero.', quote: 'Un script no es una máquina virtual sin límites: la expresividad surge entre transacciones y cada validación sigue siendo finita.', cards: [
			{ title: 'Protocolos Sigma', text: 'Pruebas no interactivas autorizan el gasto sin revelar el testigo. Las políticas de umbral pueden exigir k de n participantes.' },
			{ title: 'Contratos multietapa', text: 'Una caja representa un estado y su gasto crea el siguiente. Encadenar transiciones permite cómputo general sin trabajo ilimitado dentro de un bloque.' },
			{ title: 'NIPoPoWs', text: 'Pruebas compactas resumen el trabajo acumulado para clientes ligeros y protocolos entre cadenas. El soporte del nodo existe; cada integración varía.' }
		] },
		sustainability: { ...en.home.sustainability, eyebrow: 'Diseño a largo plazo', title: 'El estado inactivo paga por ocupar el registro.', intro: 'Una caja sin tocar durante cuatro años puede pagar alquiler de almacenamiento. Con los parámetros actuales son aproximadamente 0,14 ERG por cuatro años para una caja típica, según su tamaño.', cards: [
			{ title: 'El estado tiene un coste', text: 'El alquiler desincentiva el crecimiento permanente del UTXO y devuelve valor abandonado a la seguridad de la red.' },
			{ title: 'Ingresos tras la emisión', text: 'El alquiler complementa las comisiones cuando disminuye la emisión. Es un mecanismo, no una garantía de ingresos suficientes.' },
			{ title: 'Parámetros actualizables', text: 'La votación minera y los campos de extensión permiten activar cambios compatibles mediante soft forks. EIP-27 amplió así la emisión.' }
		] },
		economics: { ...en.home.economics, eyebrow: 'Economía', title: 'Una oferta conocida, distribuida mediante minería.', intro: 'Mainnet arrancó el 1 de julio de 2019. ERG no tuvo ICO ni asignación a capital riesgo; la Fundación recibe el 4,43 % de la emisión mediante un contrato transparente.', stats: [
			{ value: '97,739 M', label: 'oferta máxima programada de ERG' }, { value: '4,43 %', label: 'parte del tesoro de la Fundación' }, { value: '4 años', label: 'horizonte del alquiler' }, { value: 'EIP-27', label: 'soft fork de extensión de emisión' }
		], body: 'Babel Fees permite obtener atómicamente el ERG de la comisión desde una caja de liquidez pagando al proveedor con otro token. La comisión del protocolo sigue pagándose en ERG.' },
		applications: { ...en.home.applications, eyebrow: 'Aplicaciones', title: 'Primitivas financieras que ya funcionan en cadena.', intro: 'El diseño de Ergo se materializa en sistemas desplegados. Cada aplicación conserva sus propios riesgos de contratos, liquidez y puentes.', cards: en.home.applications.cards.map((card, i) => ({ ...card, title: ['SigmaUSD','Oracle Pools','Rosen Bridge','Spectrum','ErgoMixer / SigmaJoin','Auction House y NFT'][i], text: [
			'Protocolo de reserva sobre AgeUSD que emite SigUSD y SigRSV bajo reglas de ratio de reservas; está sobrecolateralizado.',
			'Varios participantes publican y agregan datos en cadena. Las entradas de datos permiten consultarlos sin consumir la caja.',
			'Puente entre cadenas coordinado desde Ergo mediante watchers y guards. Conviene comprobar siempre las rutas y el estado actual.',
			'Exchange no custodial basado en contratos eUTXO, con mercados AMM y trabajo de libro de órdenes en el ecosistema.',
			'Protocolos de privacidad no custodiales basados en pruebas Sigma. La privacidad depende del uso y del conjunto de anonimato.',
			'Los tokens nativos y registros permiten subastas, regalías, metadatos y acuñación sin un contrato por cada activo.'
		][i] })) },
		community: { ...en.home.community, eyebrow: 'Desde ErgoForum', title: 'Un laboratorio de economía programable.', intro: 'La comunidad investiga sus diseños en público. Son debates y propuestas, no afirmaciones de que cada sistema esté desplegado.', cards: en.home.community.cards.map((card, i) => ({ ...card, title: ['Escalar Ergo','Stablecoins Dexy','Gobernanza de oráculos','Crowdfunding','LETS y crédito local','Agorismo','Firmas distribuidas','Máquinas autónomas'][i], text: [
			'Validación sin estado, cadenas de transacciones, protocolos fuera de cadena, sidechains e investigación sobre subbloques.',
			'Diseños asistidos por oráculos con mecanismos de contracción y expansión; distintos de SigmaUSD y dependientes de cada implementación.',
			'Cómo actualizar participantes y parámetros de oráculos y protocolos de reserva sin un operador central.',
			'Contratos pequeños pueden imponer condiciones de todo-o-reembolso directamente sobre el grafo UTXO.',
			'Sistemas locales de intercambio exploran crédito mutuo y contabilidad comunitaria, no mera emisión especulativa.',
			'Comercio sin permiso, contraeconomía pacífica y resistencia a la censura forman parte explícita de la conversación social.',
			'La investigación de firmas de umbral y distribuidas aprovecha la composición de proposiciones Sigma nativas.',
			'Emisión por subasta, tokens perpetuos y agentes económicos prueban qué pueden hacer los contratos automantenidos.'
		][i] })) },
		mission: { ...en.home.mission, eyebrow: 'Por qué existe Ergo', title: 'Herramientas para quienes están en los márgenes del sistema financiero.', body: 'El manifiesto de Ergo defiende contratos financieros abiertos y resistentes a la censura, privacidad cuando sea necesaria y valor controlado por sus usuarios. No pretende poner todo en una blockchain: busca dinero contractual robusto.', links: [ { ...en.home.mission.links[0], label: 'Leer el Manifiesto de Ergo' }, { ...en.home.mission.links[1], label: 'Entrar en ErgoForum' } ] },
		sources: { ...en.home.sources, eyebrow: 'Verifica, no confíes', title: 'Fuentes primarias', body: 'Esta web separa hechos del protocolo y afirmaciones del ecosistema. Empieza por la especificación y las propuestas de mejora; la disponibilidad puede cambiar.', links: en.home.sources.links.map((link, i) => ({ ...link, label: ['Documentación oficial','Código del nodo Ergo','Propuestas de mejora de Ergo','ErgoForum'][i] })) }
	}
};
