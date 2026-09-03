/*
 * Spanish copy.
 *
 * Written against en.js key-for-key. English is still spread in as the
 * safety net for anything added there and not yet translated here, but
 * nothing below should be relying on it — index-based `map` tricks were
 * removed after they silently mistranslated cards whose order changed.
 */

import en from './en.js';

export default {
	...en,

	common: {
		...en.common,
		toTop: '↑ Arriba',
		backToTop: 'Volver arriba',
		visit: 'Visitar',
		languageLabel: 'Idioma',
		switchLanguage: 'Cambiar idioma',
		scroll: 'Desplázate',
		toc: {
			nav: 'Navegación por secciones',
			title: 'En esta página',
			open: 'Abrir el menú de secciones',
			close: 'Cerrar el menú de secciones'
		}
	},

	theme: {
		toLight: 'Cambiar al tema claro',
		toDark: 'Cambiar al tema oscuro',
		toggle: 'Cambiar tema'
	},

	topbar: {
		nav: 'Secciones de Ergo',
		links: {
			technology: { label: 'Tecnología', short: 'Tecnología' },
			economics: { label: 'Economía', short: 'Economía' },
			applications: { label: 'Aplicaciones', short: 'Apps' },
			mission: { label: 'Misión', short: 'Misión' }
		}
	},

	home: {
		...en.home,

		meta: {
			title: 'Ergo Basics — Dinero contractual',
			description:
				'Una introducción visual y documentada a Ergo: el modelo eUTXO, ErgoScript y los protocolos Sigma, el alquiler de almacenamiento, la prueba de trabajo, las stablecoins y el crédito mutuo entre pares.'
		},

		hero: {
			eyebrow: 'Dinero programable, construido desde primeros principios',
			title: 'Ergo es una blockchain para el dinero contractual.',
			body: 'Seguridad inspirada en Bitcoin, contratos eUTXO expresivos y pruebas que preservan la privacidad: diseñada para unas finanzas útiles sin intermediarios de confianza.',
			primary: 'Entender la tecnología',
			secondary: 'Explorar el ecosistema',
			note: 'Prueba de trabajo · 1 de julio de 2019 · sin ICO · sin asignación a capital riesgo'
		},

		index: {
			sections: {
				foundations: 'Fundamentos',
				boxes: 'Cajas',
				sigma: 'Pruebas',
				pow: 'Prueba de trabajo',
				rent: 'Alquiler',
				pillars: 'Cuatro pilares',
				stablecoins: 'Stablecoins',
				credit: 'Crédito mutuo',
				vision: 'Mercados p2p',
				economics: 'Economía',
				applications: 'Aplicaciones',
				community: 'Ideas',
				mission: 'Misión',
				sources: 'Fuentes'
			}
		},

		scenes: {
			boxes: {
				label: 'El modelo eUTXO',
				beats: [
					{
						h: 'El estado vive en cajas.',
						p: 'Cada salida no gastada es una <strong>caja</strong>: contiene ERG, tokens nativos, un script de guarda y datos tipados. R0–R3 son obligatorios; R4–R9 son tuyos.'
					},
					{
						h: 'Una transacción consume y crea.',
						p: 'Las entradas se destruyen y las salidas se crean. Como la transacción declara exactamente qué cajas toca, la validación es <strong>local y predecible</strong>: no hay una cuenta global sobre la que razonar.'
					},
					{
						h: 'Algunas cajas solo se leen.',
						p: 'Una <strong>entrada de datos</strong> se referencia sin gastarse. Muchas transacciones pueden leer el mismo oráculo en el mismo bloque, así que nadie tiene que ganar una carrera para usar un estado compartido.'
					}
				]
			},
			sigma: {
				label: 'Proposiciones Sigma',
				beats: [
					{
						h: 'Cada hoja es una prueba, no una contraseña.',
						p: 'ErgoScript se apoya en los <strong>protocolos Sigma</strong>: pruebas no interactivas de conocimiento de un logaritmo discreto. Gastar demuestra un enunciado en lugar de revelar un secreto.'
					},
					{
						h: 'Las pruebas se componen.',
						p: 'Se combinan con <strong>AND</strong>, <strong>OR</strong> y operadores de umbral. Las firmas en anillo y la multifirma no son añadidos: son lo que el lenguaje ya sabe decir.'
					},
					{
						h: 'La política es la condición.',
						p: '<strong>atLeast(2)</strong> lo impone el consenso, no una convención de la aplicación. Solo hace falta revelar las ramas que realmente satisfacen el enunciado.'
					}
				]
			},
			pow: {
				label: 'Producción de bloques sin permiso',
				beats: [
					{
						h: 'Cualquiera puede producir un bloque.',
						p: 'La prueba de trabajo pide una máquina y electricidad. <strong>No hay registro al que unirse</strong>, ni participación que bloquear, ni identidad que revelar: un minero nuevo simplemente empieza a calcular.'
					},
					{
						h: 'Encontrar un bloque no pide permiso a nadie.',
						p: 'Quien lo encuentra lo difunde y la red lo verifica. La participación no se puede revocar, porque nunca hubo una lista en la que estuvieras.'
					},
					{
						h: 'Coordinar crea palanca.',
						p: 'Cuando la producción de bloques pasa por un conjunto conocido y sus relés, cada salto es un punto donde una transacción puede retrasarse, reordenarse o descartarse, y donde a un operador se le puede identificar y presionar.'
					}
				]
			},
			rent: {
				label: 'Alquiler de almacenamiento',
				beats: [
					{
						h: 'El estado intacto no es gratis.',
						p: 'Una caja sin gastar durante <strong>cuatro años</strong> pasa a estar sujeta al alquiler de almacenamiento, cobrado por byte por el subprotocolo correspondiente.'
					},
					{
						h: 'El registro cobra.',
						p: 'Los mineros pueden cobrar el alquiler —unos <strong>0,14 ERG cada cuatro años</strong> para una caja sencilla— o gastar la caja entera si su valor no lo cubre.'
					},
					{
						h: 'El lastre se convierte en ingreso.',
						p: 'El estado abandonado deja de ser un coste permanente para cada nodo y pasa a pagar la seguridad de la red. Recolección de basura que se financia sola.'
					}
				]
			},
			credit: {
				label: 'Crédito mutuo',
				beats: [
					{
						h: 'El dinero puede empezar como una promesa.',
						p: 'En <strong>ChainCash</strong> cualquiera puede emitir un pagaré. Es dinero porque alguien lo aceptó, no porque a un emisor se le autorizara.'
					},
					{
						h: 'Cada portador cofirma.',
						p: 'A medida que circula, el pagaré acumula firmas. Su respaldo es la <strong>confianza colectiva</strong> de todos los que lo aceptaron: cuanto más circula, más razones hay para confiar en él.'
					},
					{
						h: 'Las reservas son opcionales, no obligatorias.',
						p: 'Se pueden añadir reservas en cadena para <strong>reducir</strong> la confianza necesaria donde esta se agota. Se empieza por las personas y se recurre a la blockchain solo cuando hace falta.'
					}
				]
			}
		},

		foundations: {
			eyebrow: 'Los fundamentos',
			title: 'Consenso conservador. Contratos modernos.',
			intro:
				'Ergo parte de las ideas contrastadas de UTXO y prueba de trabajo, y las amplía sin convertir la validación en cómputo sin límites.',
			cards: [
				{
					title: 'UTXO extendido',
					text: 'El estado vive en cajas discretas, no en una cuenta global. Cada transacción declara qué cajas consume: las dependencias son explícitas y la validación local es predecible.'
				},
				{
					title: 'ErgoScript',
					text: 'Lenguaje tipado y determinista para condiciones de gasto. Cada script está acotado; los contratos multietapa expresan procesos prolongados mediante transacciones auditables.'
				},
				{
					title: 'Autolykos v2',
					text: 'Prueba de trabajo intensiva en memoria y pensada para GPU de consumo. v2 abandonó la resistencia original a pools cuando los contratos hicieron impracticable ese objetivo.'
				}
			]
		},

		boxes: {
			eyebrow: 'El modelo eUTXO',
			title: 'Una caja puede contener valor, tokens, datos y lógica.',
			intro:
				'Cada salida no gastada es una caja Ergo. R0–R3 contienen valor, script, tokens y metadatos de creación; R4–R9 almacenan datos tipados.',
			points: [
				{
					n: '01',
					title: 'Activos nativos',
					text: 'Los tokens son contenidos de primer nivel, no saldos mantenidos por otro contrato.'
				},
				{
					n: '02',
					title: 'Entradas de datos',
					text: 'Una transacción lee una caja sin consumirla. Muchas operaciones consultan el mismo oráculo sin competir por gastarlo.'
				},
				{
					n: '03',
					title: 'Razonamiento local',
					text: 'El contrato valida entradas, salidas y contexto declarados. Las cajas independientes permiten concurrencia; una caja compartida aún puede crear contención.'
				},
				{
					n: '04',
					title: 'Cómputo fuera de cadena',
					text: 'El usuario construye la transacción fuera de cadena y los mineros verifican una prueba finita.'
				}
			]
		},

		proofs: {
			eyebrow: 'Autorización programable',
			title: 'Demuestra la condición; revela solo lo necesario.',
			intro:
				'ErgoScript compone proposiciones Sigma mediante AND, OR y umbrales. Permite multifirma, autorización tipo anillo y protocolos de conocimiento cero.',
			quote:
				'Un script no es una máquina virtual sin límites: la expresividad surge entre transacciones y cada validación sigue siendo finita.',
			cards: [
				{
					title: 'Protocolos Sigma',
					text: 'Pruebas no interactivas autorizan el gasto sin revelar el testigo. Las políticas de umbral pueden exigir k de n participantes.'
				},
				{
					title: 'Contratos multietapa',
					text: 'Una caja representa un estado y su gasto crea el siguiente. Encadenar transiciones permite cómputo general sin trabajo ilimitado dentro de un bloque.'
				},
				{
					title: 'NIPoPoWs',
					text: 'Pruebas compactas resumen el trabajo acumulado para clientes ligeros y protocolos entre cadenas. El soporte del nodo existe; cada integración varía.'
				}
			]
		},

		pow: {
			eyebrow: 'Consenso',
			title: 'Por qué prueba de trabajo, para un dinero que no debe poder detenerse.',
			intro:
				'Este es un argumento sobre arquitectura, no sobre bandos. Si el objetivo es una infraestructura financiera que siga funcionando cuando alguien poderoso preferiría que no lo hiciera, la pregunta es sencilla: ¿cuántas partes deben cooperar para que un pago se incluya, y se puede identificar y presionar a alguna de ellas?',
			cards: [
				{
					title: 'Sin relés en el camino',
					text: 'Un minero arma un bloque y lo difunde. No hay relé, ni constructor, ni ronda de comité entre una transacción válida y el bloque que la contiene. Cada capa añadida a ese camino es un lugar donde aplicar censura.'
				},
				{
					title: 'Ninguna lista de la que borrarte',
					text: 'El consenso por participación necesita un conjunto conocido de validadores: enumerable, localizable y en la práctica concentrado. La prueba de trabajo no tiene tal conjunto. Un minero puede aparecer de forma anónima, contribuir y desaparecer sin registrarse jamás.'
				},
				{
					title: 'La simplicidad es una propiedad de seguridad',
					text: 'Menos piezas móviles significan menos supuestos de confianza y menos cosas que puedan romperse en silencio. Una regla de consenso que cabe en la cabeza es una regla que se puede auditar, y que otra implementación puede reproducir de verdad.'
				},
				{
					title: 'La influencia no se acumula sola',
					text: 'Los sistemas de participación tienden a dirigir las recompensas hacia quien ya participa, así que el capital que ya tiene influencia adquiere más. El trabajo hay que volver a gastarlo en cada bloque: el hashrate de ayer no otorga autoridad hoy.'
				}
			],
			historyTitle: 'El intento de Ergo contra los pools, y qué pasó',
			historyBody:
				'Ergo se lanzó con <strong>no-externalización (débil)</strong>, probablemente la primera moneda de prueba de trabajo en incorporarla, precisamente para dificultar la formación de pools. En la práctica tuvo inconvenientes reales y los pools acabaron apareciendo igualmente mediante rodeos basados en contratos, así que <strong>Autolykos v2 la eliminó</strong>. Es historia que conviene conocer, no una característica que reivindicar.',
			lithosTitle: 'Lithos: minería descentralizada, segundo intento',
			lithosBody:
				'Lithos persigue el mismo objetivo por otra vía: un protocolo agnóstico de la cadena que usa Stratum como capa de red y evalúa <strong>pruebas de participación no interactivas</strong> en lugar de shares de pool, con contratos de colateral que permiten a prestamistas obtener rendimiento respaldando pools y a los mineros insertar transacciones directamente en los bloques. <strong>Estado: testnet.</strong> Las primeras versiones públicas llegaron en noviembre de 2025 y requieren un nodo completamente sincronizado y Java 11. No es software de producción.'
		},

		rent: {
			eyebrow: 'Diseño a largo plazo',
			title: 'El registro cobra por el estado inactivo.',
			intro:
				'La mayoría de cadenas tratan el almacenamiento como gratuito para siempre: se escribe una vez y todos los nodos futuros cargan con ello. Ergo le pone precio. Una caja intacta durante cuatro años pasa a estar sujeta al alquiler de almacenamiento, una idea más cercana a la oxidación monetaria que a una comisión.',
			stats: [
				{ value: '4 años', label: 'de inactividad antes del cobro' },
				{ value: '≈0,14 ERG', label: 'por 4 años, caja sencilla típica' },
				{ value: '1.051.200', label: 'bloque en que empezó el cobro' },
				{ value: '20 jul 2023', label: 'activo en mainnet desde' }
			],
			cards: [
				{
					title: 'Cómo se cobra',
					text: 'La tarifa es por byte, fijada por el subprotocolo de alquiler, así que cada caja paga en proporción al estado que realmente ocupa. Para una caja sin tokens ni scripts complejos son unos 0,14 ERG cada cuatro años.'
				},
				{
					title: 'O la caja simplemente se gasta',
					text: 'Si la caja no tiene ERG suficiente para cubrir el alquiler, un minero puede gastarla por completo. Esta es la parte que la convierte en recolección de basura y no en un impuesto: el estado muerto no se queda, se limpia.'
				},
				{
					title: 'Los tokens y NFT no están exentos',
					text: 'Si el ERG de la caja no puede pagar el alquiler, el minero puede quedarse con los activos que contiene, incluidos NFT y stablecoins. Es un riesgo real para quien aparca objetos de valor en una caja y se olvida. Mantén ERG suficiente en las cajas que te importan.'
				},
				{
					title: 'Ingresos cuando acabe la emisión',
					text: 'El alquiler complementa las comisiones cuando la emisión programada se agote, dando a los mineros una fuente de ingresos que no depende de nueva emisión. Es un mecanismo, no la promesa de que esos ingresos vayan a bastar.'
				},
				{
					title: 'Contra el acaparamiento y la iliquidez',
					text: 'Un pequeño coste por mantener estado inactivo empuja a las monedas de vuelta a la circulación. Es diseño monetario deliberado, en la tradición de la oxidación, no un efecto secundario del modelo de comisiones.'
				},
				{
					title: 'Consolida tus cajas',
					text: 'Nautilus incorpora consolidación de cajas y avisa cuando tu conjunto UTXO la necesita; TokenJay ofrece una herramienta que informa de la edad de cada caja. Consolidar reinicia el contador y es la mitigación habitual.'
				}
			],
			eipsTitle: 'Dónde se están trabajando las reglas',
			eips: [
				{
					label: 'EIP-39 — regla de altura de creación monótona',
					href: 'https://github.com/ergoplatform/eips/blob/master/eip-0039.md'
				},
				{
					label: 'EIP-45 — contratos de redistribución del alquiler (PR)',
					href: 'https://github.com/ergoplatform/eips/pull/93'
				},
				{
					label: 'EIP-33 — quema de tokens al cobrar el alquiler (PR)',
					href: 'https://github.com/ergoplatform/eips/pull/68'
				},
				{
					label: 'Reducir el periodo de alquiler (HF-4.0) — rechazado',
					href: 'https://github.com/ergoplatform/ergo/issues/1144'
				}
			]
		},

		pillars: {
			eyebrow: 'El planteamiento de kushti',
			title: 'Cuatro pilares del dinero del siglo XXI independiente del Estado.',
			intro:
				'El fundador de Ergo, Alexander Chepurnoy (kushti), describe el dinero independiente del Estado como algo que necesita cuatro capas, todas con confianza minimizada. Su afirmación es que el ecosistema de Ergo ya tiene las cuatro a la vez, por primera vez en algún sitio.',
			items: [
				{
					n: '01',
					title: 'Un registro neutral y un activo de reserva',
					text: 'Programable, con confianza minimizada y que no es pasivo de nadie. Ergo y ERG: prueba de trabajo, sin ICO, sin asignación a capital riesgo y sin preminado convencional.',
					anchor: '#pow'
				},
				{
					n: '02',
					title: 'Derivados y stablecoins con confianza minimizada',
					text: 'Valor estable e instrumentos financieros construidos como contratos sobre esa reserva, no como la promesa de una empresa. SigmaUSD, Gluon, Dexy y USE.',
					anchor: '#stablecoins'
				},
				{
					n: '03',
					title: 'Puentes y rampas de entrada con confianza minimizada',
					text: 'Entrar y salir sin un custodio en medio. Rosen Bridge, y mercados de entrada y salida entre pares viables gracias a seguros con confianza minimizada.',
					anchor: '#applications'
				},
				{
					n: '04',
					title: 'Creación de dinero encima, con confianza minimizada',
					text: 'Dinero como medio de intercambio emitido por unas personas a otras, con reservas usadas solo para reducir la confianza necesaria, no para conceder permiso. ChainCash y Basis.',
					anchor: '#credit'
				}
			],
			note: 'Se presenta como la tesis de kushti sobre el ecosistema, no como un hecho neutral del protocolo. Los pilares segundo y cuarto en particular contienen sistemas con grados de madurez muy distintos: consulta el estado en cada sección.'
		},

		stablecoins: {
			eyebrow: 'Valor estable',
			title: 'Cuatro enfoques de la estabilidad, todos respaldados por colateral.',
			intro:
				'Ninguno es un peg algorítmico sin colateral del tipo que fracasó en otros sitios. Todos mantienen reservas reales y se diferencian en cómo las valoran, las dividen y las defienden.',
			cards: [
				{
					title: 'SigmaUSD',
					status: 'En producción',
					text: 'La primera stablecoin basada en UTXO, una instancia del protocolo AgeUSD cuyo modelo económico se diseñó junto a IOHK, Ergo y Emurgo. Sus parámetros conservadores de reserva hacen que <strong>evite por completo las liquidaciones</strong>: quien tiene SigUSD queda aislado, mientras quien tiene SigRSV absorbe la volatilidad a cambio del potencial de subida. Sobrecolateralizada, y en funcionamiento a través de las caídas de mercado desde principios de 2021.',
					link: 'https://sigmausd.io/'
				},
				{
					title: 'Gluon',
					status: 'En producción · ligada al oro',
					text: 'Diseñada por Bruno Woltzenlogel Paleo con la Djed Alliance. En lugar de emitir tokens nuevos, <strong>divide uno existente</strong> en componentes estables e inestables, con una metáfora tomada de la física nuclear: la <em>fisión</em> divide ERG en stablecoin y reservecoin, la <em>fusión</em> las recombina y la <em>desintegración beta</em> convierte entre ambas como un swap de AMM. Conceptualmente, el dual de un pool de liquidez. El producto en producción está ligado al oro: <strong>GAU</strong> sigue un gramo de oro y <strong>GAUC</strong> tokeniza el excedente de reserva con volatilidad y rendimiento apalancados. Ambos totalmente respaldados por ERG.',
					link: 'https://gluon.gold/'
				},
				{
					title: 'Dexy',
					status: 'Diseño en curso',
					text: 'Una familia de diseños asistidos por oráculos que usa <strong>señoreaje</strong> en lugar de una banda de ratio de reservas, buscando una stablecoin más simple de lo que exige AgeUSD. Un enfoque distinto de SigmaUSD y dependiente de su implementación.',
					link: 'https://www.ergoforum.org/t/dexy-usd-simplest-stablecoin-design/1430'
				},
				{
					title: 'USE',
					status: 'En producción · pragmática',
					text: 'Un activo ligado al dólar con un modelo conservador de <strong>reserva 1:1</strong>. El razonamiento es pragmático: las stablecoins de dólar centralizadas concentran la mayor parte de la liquidez en cadena y traen riesgo de censura, pero negarse a interoperar aísla a Ergo y perjudica a los usuarios corrientes. Está construida para ser barata: comisiones de puente en torno al 0,1 %, una instancia de AMM dedicada al 0,05 % en una banda estrecha y seis decimales para encajar con las principales plazas. StableMiner permite acuñarla localmente desde el monedero de un nodo, y los ejemplos de pago x402 publicados usan <strong>Babel Fees</strong>, de modo que se puede gastar USE sin tener ERG para la comisión del minero.',
					link: 'https://docs.ergoplatform.com/uses/use_stablecoin/'
				}
			],
			concernsTitle: 'Limitaciones conocidas',
			concernsBody:
				'Bruno Woltzenlogel Paleo —que diseñó Gluon en parte como respuesta— ha catalogado las debilidades de la familia AgeUSD: <strong>sensibilidad al oráculo</strong>, <strong>drenaje de reservas por grandes tenedores</strong>, la imposibilidad de vender reservecoins por debajo del umbral de colateral y el problema del capital cero. Las stablecoins de Ergo son ingeniería, no magia, y se discuten públicamente como tales.'
		},

		credit: {
			eyebrow: 'ChainCash y Basis',
			title: 'Dinero que empieza en las personas, no en una cadena.',
			intro:
				'ChainCash es un sistema monetario para la creación elástica de dinero, que combina la confianza entre personas con reservas opcionales respaldadas por blockchain. Su ambición es poco común: permitir que la gente cree crédito entre sí sin saber nada de Ergo, y recurrir a los activos en cadena solo donde la confianza necesita refuerzo.',
			cards: [
				{
					title: 'Moneda firmada por quien la gasta',
					text: 'Cualquiera puede emitir un pagaré. Cuando quien lo tiene lo gasta, lo cofirma; así, un pagaré que ha circulado mucho lleva el respaldo de todos los que lo aceptaron. Su valor refleja una red de confianza, no el balance de un único emisor.'
				},
				{
					title: 'Elástico por construcción',
					text: 'Los activos de oferta fija son malos medios de intercambio precisamente porque la oferta no puede responder a la demanda. ChainCash permite que el dinero se expanda y se contraiga con la actividad económica real, sin que un banco central decida cuándo.'
				},
				{
					title: 'Basis: pagos fuera de la cadena',
					text: 'Basis mantiene el estado de deuda mutua con <strong>trackers</strong> de confianza mínima, y lo compromete en cadena como un resumen de árbol AVL. Los contratos de Ergo gestionan el canje e impiden el doble canje, así que los pagos pequeños no necesitan tocar la cadena. La deuda es transferible con el consentimiento del emisor.'
				},
				{
					title: 'Las reservas reducen confianza, no conceden permiso',
					text: 'Las reservas en cadena son colateral opcional que un participante puede añadir para que sus pagarés sean más aceptables. Si un tracker se cae, el dueño de la reserva puede retirarla tras un retardo configurado.'
				}
			],
			lineageTitle: 'De dónde viene la idea',
			lineageBody:
				'El modelo de moneda firmada por quien la gasta se describió en <em>Peer-to-Peer Money: Free Currency over the Internet</em>, de Kenji Saito, y se adaptó al entorno de Ergo. Encima se ha construido <a href="https://github.com/fitzss/agent-credit" target="_blank" rel="noopener noreferrer">Agent Credit</a> y experimentos de pagos entre agentes.',
			statusTitle: 'Estado: prototipo',
			statusBody:
				'Conviene ser claro con esto. ChainCash y Basis son <strong>investigación activa y software en prototipo</strong>, no un carril de pagos integrado en monederos. Los contratos y las API cambiaron con frecuencia durante 2026, y algunas rutas de transferencia todavía requieren <strong>firmas Schnorr en crudo</strong>, así que el soporte normal de monedero sigue siendo limitado. En junio se envió a revisión un whitepaper de Basis y existen un artículo y una presentación para RAMICS-26. Trata los detalles publicados como una referencia en movimiento y verifícalos en los repositorios antes de construir encima.',
			links: [
				{ label: 'Documentación de ChainCash', href: 'https://docs.ergoplatform.com/uses/chaincash/' },
				{ label: 'ChainCash Labs en GitHub', href: 'https://github.com/ChainCashLabs' },
				{ label: 'Tracker de Basis (prototipo)', href: 'https://github.com/BetterMoneyLabs/basis-tracker' },
				{
					label: 'ErgoForum: una moneda firmada por quien la gasta',
					href: 'https://www.ergoforum.org/t/chaincash-a-spender-signed-currency-on-ergo/4015'
				}
			]
		},

		vision: {
			eyebrow: 'La visión de kushti para el ecosistema',
			title: '«Mercados p2p en todas partes».',
			intro:
				'El fundador de Ergo, Alexander Chepurnoy, ha expuesto cómo ve el desarrollo del ecosistema. Conviene leerlo como la dirección declarada de una persona y no como una hoja de ruta que el protocolo garantice, que es más o menos como él mismo lo plantea.',
			diagnosis: {
				title: 'La industria que describe',
				body: 'Su lectura del mercado es sombría y concreta: hackeos prácticamente a diario, lanzamientos de token muertos, la mayor parte del capital riesgo muerto, asignaciones de iniciados con vesting que el minorista no absorbe y congresos con un único tema, la institucionalización, que en la práctica suele significar sustituir el Bitcoin real por un derecho de papel sobre él mientras se tokenizan productos tradicionales para ganar exposición. Mientras tanto, la demanda original crece: aumenta la preocupación por la privacidad, las monedas fiat siguen fallando por todo el mundo y los mercados financieros de muchos lugares parecen frágiles.'
			},
			tracksTitle: 'Tres mercados que preservar y ampliar',
			tracks: [
				{
					n: '01',
					title: 'Producción descentralizada de bloques',
					text: 'La prueba de trabajo ya es un mercado entre pares: cualquiera puede generar un bloque. Ergo se lanzó con no-externalización débil para evitar la formación de pools; tuvo inconvenientes y los pools aparecieron igualmente. Ahora Lithos aborda el mismo objetivo mediante pruebas de participación y contratos de colateral, con nuevos mercados formándose alrededor de la propia minería. En testnet.'
				},
				{
					n: '02',
					title: 'Rampas de entrada y salida entre pares',
					text: 'Los mercados p2p que ya existen para ERG, Bitcoin y Monero están limitados por el riesgo de contraparte. Un seguro con confianza minimizada los democratizaría notablemente: es el tema del Ergo Darkpaper de ErgoRich y del trabajo en curso en ErgoForum sobre seguros para la entrada desde Bitcoin.'
				},
				{
					n: '03',
					title: 'Crédito mutuo entre pares',
					text: 'Basis: crédito creado sobre la confianza entre personas que no necesitan saber nada de Ergo ni de blockchains, usando activos en cadena solo para reducir esa confianza. La expresión más directa de la tesis.'
				}
			],
			supportTitle: 'Qué hace que todo funcione mejor',
			supportBody:
				'Herramientas de privacidad en todo el recorrido: el protocolo de mezcla, las direcciones sigilosas. Rosen para el paso entre cadenas. La prioridad declarada son <strong>productos útiles para gente de fuera de Ergo, o de fuera del cripto por completo</strong>, con Ergo como caballo de tiro por debajo. Lo siguiente en la lista: más herramientas DeFi, pools de liquidez concentrada y mezcladores de mayor escala.',
			cards: [
				{
					title: 'Hojas de ruta, reconsideradas',
					text: 'Hacia 2019-20, cuando el ecosistema era más pequeño y estaba más centralizado, había hojas de ruta; se abandonaron por no encajar con una comunidad en crecimiento. Lo que se propone ahora tiene forma de hoja de ruta pero otro propósito: un objeto central para el diálogo, para comprobar el avance y para revisiones cruzadas de seguridad en un contexto amplio. No un plan impuesto desde arriba.'
				},
				{
					title: 'Una cultura de desarrollo que merece mención',
					text: 'kushti destaca algo que ocurre en los círculos de desarrollo de Ergo: se están usando agentes LLM para endurecer la implementación del protocolo central y los contratos inteligentes del ecosistema, mediante discusión constante entre personas combinada con revisiones cruzadas de los modelos. Bastante infraestructura se ha entregado así últimamente.'
				}
			]
		},

		economics: {
			eyebrow: 'Economía',
			title: 'Una oferta conocida, distribuida mediante minería.',
			intro:
				'Mainnet arrancó el 1 de julio de 2019. ERG no tuvo ICO ni asignación a capital riesgo; la Fundación recibe el 4,43 % de la emisión mediante un contrato transparente.',
			stats: [
				{ value: '97,739 M', label: 'oferta máxima programada de ERG' },
				{ value: '4,43 %', label: 'parte del tesoro de la Fundación' },
				{ value: '4 años', label: 'horizonte del alquiler' },
				{ value: 'EIP-27', label: 'soft fork de extensión de emisión' }
			],
			body: 'Babel Fees permite obtener atómicamente el ERG de la comisión desde una caja de liquidez pagando al proveedor con otro token. La comisión del protocolo sigue pagándose en ERG.'
		},

		applications: {
			eyebrow: 'Aplicaciones',
			title: 'Primitivas financieras que ya funcionan en cadena.',
			intro:
				'El diseño de Ergo se materializa en sistemas desplegados. No toda propuesta es un producto terminado, y cada aplicación conserva sus propios riesgos de contratos, liquidez y puentes.',
			cards: [
				{
					title: 'Oracle Pools',
					text: 'Varios participantes publican y agregan datos en cadena. Las entradas de datos permiten consultarlos sin consumir la caja del oráculo.',
					link: 'https://docs.ergoplatform.com/eco/oracle-pools/'
				},
				{
					title: 'Rosen Bridge',
					text: 'Puente entre cadenas coordinado desde Ergo mediante watchers y guards. Conviene comprobar siempre las rutas admitidas y el estado actual en la aplicación.',
					link: 'https://rosen.tech/'
				},
				{
					title: 'Spectrum',
					text: 'Exchange no custodial basado en contratos eUTXO, con mercados AMM y trabajo de libro de órdenes en el ecosistema.',
					link: 'https://spectrum.fi/'
				},
				{
					title: 'ErgoMixer / SigmaJoin',
					text: 'Protocolos de privacidad no custodiales basados en pruebas Sigma. La privacidad depende del uso correcto y del conjunto de anonimato.',
					link: 'https://docs.ergoplatform.com/eco/ergomixer/'
				},
				{
					title: 'Auction House y NFT',
					text: 'Los tokens nativos y los registros permiten subastas, regalías, metadatos y acuñación sin un contrato por cada activo.',
					link: 'https://ergoauctions.org/'
				},
				{
					title: 'Lithos',
					text: 'Infraestructura de pools de minería descentralizados con pruebas de participación no interactivas y contratos de colateral. Software en testnet que requiere un nodo sincronizado.',
					link: 'https://docs.ergoplatform.com/eco/lithos/'
				}
			]
		},

		community: {
			eyebrow: 'Desde ErgoForum',
			title: 'Un laboratorio de economía programable.',
			intro:
				'La comunidad investiga sus diseños en público. Son debates y propuestas, no afirmaciones de que cada sistema esté desplegado.',
			cards: [
				{
					title: 'Escalar Ergo',
					text: 'Validación sin estado, cadenas de transacciones, protocolos fuera de cadena, sidechains e investigación sobre subbloques.',
					link: 'https://www.ergoforum.org/t/a-scalability-plan-for-ergo/226'
				},
				{
					title: 'Gobernanza de oráculos',
					text: 'Cómo actualizar participantes y parámetros de oráculos y protocolos de reserva sin un operador central.',
					link: 'https://www.ergoforum.org/t/governance-for-oracle-pools-and-the-sigmausd-bank/786'
				},
				{
					title: 'Crowdfunding',
					text: 'Contratos pequeños pueden imponer condiciones de todo-o-reembolso directamente sobre el grafo UTXO.',
					link: 'https://www.ergoforum.org/t/simple-crowdfunding/70'
				},
				{
					title: 'LETS y crédito local',
					text: 'Los sistemas locales de intercambio exploran crédito mutuo y contabilidad comunitaria, no mera emisión especulativa.',
					link: 'https://www.ergoforum.org/t/lets-discussion-summary/3492'
				},
				{
					title: 'Agorismo',
					text: 'Comercio sin permiso, contraeconomía pacífica y resistencia a la censura forman parte explícita de la conversación social de Ergo.',
					link: 'https://www.ergoforum.org/t/please-provide-ideas-on-agorism-and-peaceful-counter-economics/3515'
				},
				{
					title: 'Firmas distribuidas',
					text: 'La investigación de firmas de umbral y distribuidas aprovecha la composición de proposiciones Sigma nativas.',
					link: 'https://www.ergoforum.org/t/improved-distributed-signatures/366'
				}
			]
		},

		mission: {
			eyebrow: 'Por qué existe Ergo',
			title: 'Herramientas para quienes están en los márgenes del sistema financiero.',
			body: 'El manifiesto de Ergo defiende contratos financieros abiertos y resistentes a la censura, privacidad cuando sea necesaria y valor controlado por sus usuarios. No pretende poner todo en una blockchain: busca dinero contractual robusto.',
			links: [
				{
					label: 'Leer el Manifiesto de Ergo',
					href: 'https://ergoplatform.org/en/blog/2021-04-26-the-ergo-manifesto/'
				},
				{ label: 'Entrar en ErgoForum', href: 'https://www.ergoforum.org/' }
			]
		},

		sources: {
			eyebrow: 'Verifica, no confíes',
			title: 'Fuentes primarias',
			body: 'Esta web separa los hechos del protocolo de las afirmaciones del ecosistema, y el software desplegado de la investigación. Empieza por la especificación y las propuestas de mejora; la disponibilidad y los parámetros pueden cambiar.',
			links: [
				{ label: 'Documentación oficial', href: 'https://docs.ergoplatform.com/' },
				{ label: 'Código del nodo Ergo', href: 'https://github.com/ergoplatform/ergo' },
				{ label: 'Propuestas de mejora de Ergo', href: 'https://github.com/ergoplatform/eips' },
				{ label: 'Alquiler de almacenamiento', href: 'https://docs.ergoplatform.com/mining/rent/' },
				{ label: 'Stablecoins', href: 'https://docs.ergoplatform.com/uses/stablecoins/' },
				{ label: 'ChainCash', href: 'https://docs.ergoplatform.com/uses/chaincash/' },
				{ label: 'ErgoForum', href: 'https://www.ergoforum.org/top' }
			]
		}
	}
};
