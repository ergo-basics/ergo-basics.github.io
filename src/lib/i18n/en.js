/*
 * English copy — the source of truth for every user-facing string, and
 * the fallback whenever another locale is missing a key.
 *
 * House rules
 * -----------
 * • Scene beats (`home.scenes.<id>.beats`) carry only words. Their
 *   timings live with the scene definitions in components/home/scenes.js.
 * • `h`/`p` inside beats may contain inline <strong>/<em>.
 * • Status honesty is not optional. Anything that is prototype,
 *   testnet or research says so in the same sentence that describes it.
 * • kushti's vision is attributed to kushti, never presented as
 *   neutral protocol fact.
 */

export default {
	common: {
		toTop: '↑ Top',
		backToTop: 'Back to top',
		visit: 'Visit',
		languageLabel: 'Language',
		switchLanguage: 'Change language',
		scroll: 'Scroll',
		toc: {
			nav: 'Section navigation',
			title: 'On this page',
			open: 'Open section menu',
			close: 'Close section menu'
		}
	},
	theme: {
		toLight: 'Switch to light theme',
		toDark: 'Switch to dark theme',
		toggle: 'Toggle theme'
	},
	topbar: {
		nav: 'Ergo sections',
		links: {
			technology: { label: 'Technology', short: 'Tech' },
			economics: { label: 'Economics', short: 'Economy' },
			applications: { label: 'Applications', short: 'Apps' },
			mission: { label: 'Mission', short: 'Mission' }
		}
	},

	home: {
		meta: {
			title: 'Ergo Basics — Contractual Money',
			description:
				'A visual, sourced introduction to Ergo: the eUTXO model, ErgoScript and Sigma protocols, storage rent, proof of work, stablecoins, and peer-to-peer mutual credit.'
		},

		hero: {
			eyebrow: 'Programmable money, built from first principles',
			title: 'Ergo is a blockchain for contractual money.',
			body: 'Bitcoin-inspired security, expressive eUTXO contracts and privacy-preserving proofs — engineered for useful finance without trusted intermediaries.',
			primary: 'Understand the technology',
			secondary: 'Explore the ecosystem',
			note: 'Proof of Work · launched 1 July 2019 · no ICO · no VC allocation'
		},

		index: {
			sections: {
				foundations: 'Foundations',
				boxes: 'Boxes',
				sigma: 'Proofs',
				pow: 'Proof of Work',
				rent: 'Storage Rent',
				pillars: 'Four Pillars',
				stablecoins: 'Stablecoins',
				credit: 'Mutual Credit',
				vision: 'p2p Markets',
				economics: 'Economics',
				applications: 'Applications',
				community: 'Ideas',
				mission: 'Mission',
				sources: 'Sources'
			}
		},

		/* ============================================================ *
		 * Scroll-scrubbed canvas scenes
		 * ============================================================ */
		scenes: {
			boxes: {
				label: 'The eUTXO model',
				beats: [
					{
						h: 'State lives in boxes.',
						p: 'Every unspent output is a <strong>box</strong>: it carries ERG, native tokens, a guarding script and typed data. Registers R0–R3 are mandatory; R4–R9 are yours.'
					},
					{
						h: 'A transaction consumes and creates.',
						p: 'Inputs are destroyed, outputs are made. Because a transaction names exactly which boxes it touches, validation stays <strong>local and predictable</strong> — no global account to reason about.'
					},
					{
						h: 'Some boxes are only read.',
						p: 'A <strong>data input</strong> is referenced without being spent. Any number of transactions can read the same oracle box in the same block, so nobody has to win a race to use shared state.'
					}
				]
			},
			sigma: {
				label: 'Sigma propositions',
				beats: [
					{
						h: 'Each leaf is a proof, not a password.',
						p: 'ErgoScript is built on <strong>Sigma protocols</strong>: non-interactive proofs of knowledge of a discrete logarithm. Spending proves a statement rather than revealing a secret.'
					},
					{
						h: 'Proofs compose.',
						p: 'Join them with <strong>AND</strong>, <strong>OR</strong> and threshold operators. Ring signatures and multi-signatures are not bolted on — they are what the language already says.'
					},
					{
						h: 'The policy is the condition.',
						p: '<strong>atLeast(2)</strong> is enforced by consensus, not by an application convention. Only the branches that actually satisfy the statement need to be revealed.'
					}
				]
			},
			pow: {
				label: 'Permissionless block production',
				beats: [
					{
						h: 'Anyone can produce a block.',
						p: 'Proof of Work asks for a machine and electricity. There is <strong>no registry to join</strong>, no stake to bond, no identity to reveal — a new miner simply starts hashing.'
					},
					{
						h: 'Finding a block asks nobody permission.',
						p: 'A winner broadcasts and the network verifies. Participation cannot be revoked, because there was never a list you were on.'
					},
					{
						h: 'Coordination creates leverage.',
						p: 'When block production runs through a known set and its relays, every hop is somewhere a transaction can be delayed, reordered or dropped — and somewhere an operator can be identified and pressured.'
					}
				]
			},
			rent: {
				label: 'Storage rent',
				beats: [
					{
						h: 'Untouched state is not free.',
						p: 'A box left unspent for <strong>four years</strong> becomes eligible for storage rent, charged per byte by the storage-rent subprotocol.'
					},
					{
						h: 'The ledger collects.',
						p: 'Miners may take the rent — roughly <strong>0.14 ERG per four years</strong> for a plain box — or spend the box outright if its value cannot cover it.'
					},
					{
						h: 'Bloat becomes revenue.',
						p: 'Abandoned state stops being a permanent cost to every node and starts paying for network security instead. On-chain garbage collection that funds itself.'
					}
				]
			},
			credit: {
				label: 'Mutual credit',
				beats: [
					{
						h: 'Money can start as a promise.',
						p: 'In <strong>ChainCash</strong>, anyone can issue an IOU note. It is money because someone accepted it, not because an issuer was authorised.'
					},
					{
						h: 'Every holder co-signs.',
						p: 'As a note travels it accumulates signatures. Its backing is the <strong>collective trust</strong> of everyone who passed it on — the more it circulates, the more it is worth trusting.'
					},
					{
						h: 'Reserves are optional, not required.',
						p: 'On-chain reserves can be attached to <strong>reduce</strong> trust where trust runs out. You start with people and reach for the blockchain only when you need it.'
					}
				]
			}
		},

		/* ============================================================ *
		 * Grounded sections
		 * ============================================================ */
		foundations: {
			eyebrow: 'The foundation',
			title: 'Conservative consensus. Modern contracts.',
			intro:
				'Ergo starts with the battle-tested UTXO and Proof-of-Work ideas, then extends them deliberately — without turning validation into an open-ended computation.',
			cards: [
				{
					title: 'Extended UTXO',
					text: 'State lives in discrete boxes, not a shared global account. A transaction declares exactly which boxes it consumes, making dependencies explicit and validation locally predictable.'
				},
				{
					title: 'ErgoScript',
					text: 'A typed, deterministic language for spending conditions. Each script is bounded; long-running computation is expressed as auditable sequences of transactions — multi-stage contracts.'
				},
				{
					title: 'Autolykos v2',
					text: 'A memory-hard Proof-of-Work algorithm designed for commodity GPUs. Its original non-outsourceability goal was removed in v2 after contract-based workarounds made pool resistance impractical.'
				}
			]
		},

		boxes: {
			eyebrow: 'The eUTXO model',
			title: 'A box can carry value, tokens, data and logic.',
			intro:
				'Every unspent output is an Ergo box. Mandatory registers R0–R3 hold value, guarding script, tokens and creation metadata; optional densely-packed R4–R9 hold typed application data.',
			points: [
				{
					n: '01',
					title: 'Native assets',
					text: 'Tokens are first-class box contents rather than balances maintained by a separate smart contract.'
				},
				{
					n: '02',
					title: 'Data inputs',
					text: 'A transaction can read a box without consuming it. Many transactions can reference the same oracle state without fighting to spend it.'
				},
				{
					n: '03',
					title: 'Local reasoning',
					text: 'A contract validates from declared inputs, outputs and context. Independent boxes can be processed concurrently; a hot shared box still creates contention.'
				},
				{
					n: '04',
					title: 'Off-chain assembly',
					text: 'Users build the transaction off-chain; miners verify a bounded proof. Computation need not become permanent global execution.'
				}
			]
		},

		proofs: {
			eyebrow: 'Programmable authorization',
			title: 'Prove the condition — reveal only what is necessary.',
			intro:
				'ErgoScript composes Sigma propositions: discrete-logarithm knowledge proofs joined with AND, OR and threshold logic. This supports multisignatures, ring-style authorization and zero-knowledge protocols at the language level.',
			quote:
				'A script is not an unlimited virtual machine. Expressiveness emerges across transactions, while each validation remains finite and costed.',
			cards: [
				{
					title: 'Sigma protocols',
					text: 'Non-interactive proofs authorize spending without exposing the witness. Threshold policies can require k-of-n participants.'
				},
				{
					title: 'Multi-stage contracts',
					text: 'A box encodes one protocol state; spending it creates the next. Chaining these state transitions can express general computation without unbounded work inside one block.'
				},
				{
					title: 'NIPoPoWs',
					text: 'Compact proofs summarize accumulated Proof of Work for light clients and cross-chain protocols. Ergo nodes support NiPoPoW bootstrap; integrations vary by product.'
				}
			]
		},

		/* ---------------- PoW vs PoS ---------------- */
		pow: {
			eyebrow: 'Consensus',
			title: 'Why Proof of Work, for money that must not be stoppable.',
			intro:
				'This is an argument about architecture, not tribalism. If the goal is financial infrastructure that keeps working when someone powerful would rather it did not, the question is simple: how many parties must cooperate for a payment to be included, and can any of them be identified and pressured?',
			cards: [
				{
					title: 'No relays in the path',
					text: 'A miner assembles a block and broadcasts it. There is no relay, no builder, no committee round between a valid transaction and a block that contains it. Every additional layer in that path is a place where censorship can be applied.'
				},
				{
					title: 'No list to be removed from',
					text: 'Stake-based consensus needs a known validator set — enumerable, addressable, and in practice concentrated. Proof of Work has no such set. A miner can appear anonymously, contribute, and vanish, without ever registering.'
				},
				{
					title: 'Simplicity is a security property',
					text: 'Fewer moving parts means fewer trust assumptions and less that can quietly break. A consensus rule you can hold in your head is one you can audit — and one an independent implementation can actually reproduce.'
				},
				{
					title: 'Influence does not compound',
					text: 'Stake systems tend to route rewards toward existing stake, so capital that already holds influence acquires more. Work must be re-spent every block; yesterday’s hashrate confers no authority today.'
				}
			],
			historyTitle: 'Ergo’s attempt at pool resistance — and what happened',
			historyBody:
				'Ergo launched with <strong>(weak) non-outsourceability</strong>, likely the first Proof-of-Work coin to ship it, specifically to make mining pools hard to form. In practice it carried real drawbacks and pooling emerged anyway through contract-based workarounds, so <strong>Autolykos v2 removed it</strong>. It is history worth knowing rather than a feature to claim.',
			lithosTitle: 'Lithos — decentralized mining, attempt two',
			lithosBody:
				'Lithos pursues the same goal by a different route: a blockchain-agnostic protocol using Stratum as its networking layer, evaluating <strong>Non-Interactive Share Proofs</strong> rather than ordinary pool shares, with collateral contracts that let lenders earn yield backing pools and miners insert transactions into blocks directly. <strong>Status: testnet.</strong> First public releases arrived in November 2025 and require a fully synced node and Java 11. Not production software.'
		},

		/* ---------------- Storage rent, in depth ---------------- */
		rent: {
			eyebrow: 'Long-term design',
			title: 'The ledger charges for dormant state.',
			intro:
				'Most chains treat storage as free forever: write once, and every future node carries it. Ergo prices it. A box untouched for four years becomes eligible for storage rent — an idea closer to demurrage than to a transaction fee.',
			stats: [
				{ value: '4 years', label: 'dormancy before rent applies' },
				{ value: '≈0.14 ERG', label: 'per 4 years, typical plain box' },
				{ value: '1,051,200', label: 'block where collection began' },
				{ value: '20 Jul 2023', label: 'live on mainnet since' }
			],
			cards: [
				{
					title: 'How it is charged',
					text: 'The fee is per byte, set by the storage-rent subprotocol, so a box pays in proportion to the state it actually occupies. For a box with no tokens and no complex script that works out at roughly 0.14 ERG every four years.'
				},
				{
					title: 'Or the box is simply spent',
					text: 'If the box does not hold enough ERG to cover the rent, a miner may spend it outright. This is the part that makes it garbage collection rather than a levy — dead state does not linger, it is cleared.'
				},
				{
					title: 'Tokens and NFTs are not exempt',
					text: 'If the ERG in a box cannot pay the rent, the miner can claim the assets inside it — including NFTs and stablecoins. This is a genuine risk to users who park valuables in a box and forget it. Keep enough ERG in boxes you care about.'
				},
				{
					title: 'Revenue after emission ends',
					text: 'Rent supplements transaction fees once scheduled block emission runs down, giving miners a revenue source that does not depend on new issuance. It is a mechanism, not a promise that future revenue will be sufficient.'
				},
				{
					title: 'Against hoarding and illiquidity',
					text: 'A small holding cost on idle state nudges coins back into circulation. This is deliberate monetary design in the demurrage tradition, not an accident of the fee model.'
				},
				{
					title: 'Consolidate your boxes',
					text: 'Nautilus has box consolidation built in and warns you when your UTXO set needs it; TokenJay offers a consolidation tool that reports box age. Consolidating resets the clock and is the standard mitigation.'
				}
			],
			eipsTitle: 'Where the rules are being worked on',
			eips: [
				{ label: 'EIP-39 — monotonic box creation height rule', href: 'https://github.com/ergoplatform/eips/blob/master/eip-0039.md' },
				{ label: 'EIP-45 — redistribution contracts for rent fees (PR)', href: 'https://github.com/ergoplatform/eips/pull/93' },
				{ label: 'EIP-33 — token burning during rent collection (PR)', href: 'https://github.com/ergoplatform/eips/pull/68' },
				{ label: 'Reducing the rent period (HF-4.0) — rejected', href: 'https://github.com/ergoplatform/ergo/issues/1144' }
			]
		},

		/* ---------------- Four pillars ---------------- */
		pillars: {
			eyebrow: 'kushti’s framing',
			title: 'Four pillars of state-independent 21st century money.',
			intro:
				'Ergo founder Alexander Chepurnoy (kushti) describes state-independent money as needing four layers, each trust-minimized. His claim is that the Ergo ecosystem now has all four at once — the first time that has been true anywhere.',
			items: [
				{
					n: '01',
					title: 'A neutral ledger and reserve asset',
					text: 'Programmable, trust-minimized, nobody’s liability. Ergo and ERG: Proof of Work, launched with no ICO, no VC allocation and no conventional premine.',
					anchor: '#pow'
				},
				{
					n: '02',
					title: 'Trust-minimized derivatives and stablecoins',
					text: 'Stable value and financial instruments built as contracts over that reserve, not as a promise from a company. SigmaUSD, Gluon, Dexy and USE.',
					anchor: '#stablecoins'
				},
				{
					n: '03',
					title: 'Trust-minimized cross-chaining and on-ramp',
					text: 'Getting in and out without a custodian standing in the middle. Rosen Bridge, plus peer-to-peer on- and off-ramp markets made viable by trust-minimized insurance.',
					anchor: '#applications'
				},
				{
					n: '04',
					title: 'Trust-minimized money creation on top',
					text: 'Medium-of-exchange money issued by people to each other, with reserves used only to reduce trust rather than to grant permission. ChainCash and Basis.',
					anchor: '#credit'
				}
			],
			note: 'Presented as kushti’s thesis about the ecosystem, not as a neutral protocol fact. Pillars two and four in particular contain systems at very different maturity levels — see each section for status.'
		},

		/* ---------------- Stablecoins ---------------- */
		stablecoins: {
			eyebrow: 'Stable value',
			title: 'Four approaches to stability, all collateral-backed.',
			intro:
				'None of these are uncollateralized algorithmic pegs of the kind that failed elsewhere. Each holds real reserves and differs in how it prices, splits and defends them.',
			cards: [
				{
					title: 'SigmaUSD',
					status: 'Live',
					text: 'The first UTXO-based stablecoin, an instantiation of the AgeUSD protocol whose economic model was designed with IOHK, Ergo and Emurgo. Conservative reserve settings mean it <strong>avoids liquidations entirely</strong>: SigUSD holders are insulated while SigRSV holders absorb volatility in exchange for upside. Overcollateralized, and running through market crashes since early 2021.',
					link: 'https://sigmausd.io/'
				},
				{
					title: 'Gluon',
					status: 'Live · gold-pegged',
					text: 'Designed by Bruno Woltzenlogel Paleo with the Djed Alliance. Rather than issuing new tokens it <strong>splits an existing one</strong> into stable and unstable components, borrowing the metaphor from nuclear physics: <em>fission</em> divides ERG into stablecoin and reservecoin, <em>fusion</em> recombines them, and <em>beta decay</em> converts between them like an AMM swap. Conceptually the dual of a liquidity pool. The live product is gold-pegged: <strong>GAU</strong> tracks one gram of gold, <strong>GAUC</strong> tokenizes the reserve surplus with leveraged volatility and yield. Both fully backed by ERG.',
					link: 'https://gluon.gold/'
				},
				{
					title: 'Dexy',
					status: 'Design in progress',
					text: 'An oracle-assisted family of designs using <strong>seigniorage</strong> rather than a reserve-ratio band, aiming at a simpler stablecoin than AgeUSD requires. A distinct approach from SigmaUSD, and specific to its implementation.',
					link: 'https://www.ergoforum.org/t/dexy-usd-simplest-stablecoin-design/1430'
				},
				{
					title: 'USE',
					status: 'Live · pragmatic',
					text: 'A USD-pegged asset on a conservative <strong>1:1 reserve model</strong>. The reasoning is pragmatic: centralized dollar stablecoins anchor most on-chain liquidity and carry censorship risk, but refusing to interoperate isolates Ergo and costs ordinary users. Built for cost efficiency — bridge fees targeted near 0.1%, a dedicated AMM instance at 0.05% within a tight band, six decimals to match major venues. StableMiner mints it locally from a node wallet, and published x402 payment examples use <strong>Babel fees</strong>, so a payer can spend USE without holding ERG for the miner fee.',
					link: 'https://docs.ergoplatform.com/uses/use_stablecoin/'
				}
			],
			concernsTitle: 'Known limitations',
			concernsBody:
				'Bruno Woltzenlogel Paleo — who designed Gluon partly in response — has catalogued the weaknesses of the AgeUSD family: <strong>sensitivity to the oracle</strong>, <strong>reserve drainage by large holders</strong>, reserve-coin holders being unable to sell below the collateral threshold, and the zero-equity problem. Ergo’s stablecoins are engineering, not magic, and they are discussed publicly as such.'
		},

		/* ---------------- ChainCash / Basis ---------------- */
		credit: {
			eyebrow: 'ChainCash & Basis',
			title: 'Money that begins with people, not with a chain.',
			intro:
				'ChainCash is a monetary system for elastic money creation, combining human trust with optional blockchain-backed reserves. Its ambition is unusual: let people create credit among themselves without knowing anything about Ergo, and reach for on-chain assets only where trust needs reinforcing.',
			cards: [
				{
					title: 'Spender-signed currency',
					text: 'Anyone can issue an IOU note. When a holder spends it, they co-sign — so a note that has circulated widely carries the backing of everyone who accepted it. Its worth reflects a web of trust rather than a single issuer’s balance sheet.'
				},
				{
					title: 'Elastic by construction',
					text: 'Fixed-supply assets are poor media of exchange precisely because supply cannot answer demand. ChainCash lets money expand and contract with real economic activity, without a central bank deciding when.'
				},
				{
					title: 'Basis: keeping payments off-chain',
					text: 'Basis holds mutual-debt state with minimally-trusted <strong>trackers</strong>, committing it on-chain as an AVL-tree digest. Ergo contracts handle redemption and prevent double-redemption, so ordinary small payments never need to touch the chain. Debt is transferable with the issuer’s consent.'
				},
				{
					title: 'Reserves reduce trust, not grant permission',
					text: 'On-chain reserves are optional collateral a participant can attach to make their notes more acceptable. If a tracker goes offline, the reserve owner can withdraw after a configured delay.'
				}
			],
			lineageTitle: 'Where the idea comes from',
			lineageBody:
				'The spender-signed model was described in Kenji Saito’s <em>Peer-to-Peer Money: Free Currency over the Internet</em>, and adapted to the Ergo setting. Work on top includes <a href="https://github.com/fitzss/agent-credit" target="_blank" rel="noopener noreferrer">Agent Credit</a> and experiments in agent-to-agent payments.',
			statusTitle: 'Status: prototype',
			statusBody:
				'Be clear-eyed about this one. ChainCash and Basis are <strong>active research and prototype software</strong>, not a finished wallet-native payment rail. Contracts and APIs changed frequently through 2026, and some transfer paths still require <strong>raw Schnorr signatures</strong>, so normal wallet support remains constrained. A Basis whitepaper went out for review in June and a RAMICS-26 paper and deck exist. Treat published details as a moving reference and verify against the repositories before building on it.',
			links: [
				{ label: 'ChainCash documentation', href: 'https://docs.ergoplatform.com/uses/chaincash/' },
				{ label: 'ChainCash Labs on GitHub', href: 'https://github.com/ChainCashLabs' },
				{ label: 'Basis tracker (prototype)', href: 'https://github.com/BetterMoneyLabs/basis-tracker' },
				{ label: 'ErgoForum: a spender-signed currency', href: 'https://www.ergoforum.org/t/chaincash-a-spender-signed-currency-on-ergo/4015' }
			]
		},

		/* ---------------- kushti's vision ---------------- */
		vision: {
			eyebrow: 'kushti’s vision for the ecosystem',
			title: '“p2p markets everywhere.”',
			intro:
				'Ergo founder Alexander Chepurnoy has set out how he sees the ecosystem developing. It is worth reading as a stated direction from one person rather than a roadmap the protocol guarantees — which is roughly how he frames it himself.',
			diagnosis: {
				title: 'The industry he is describing',
				body: 'His read on the wider market is bleak and specific: hacks on roughly a daily basis, token launches dead, most venture capital dead, vested insider allocations that retail will not absorb, and conferences with only one topic — institutionalization, which in practice often means replacing real Bitcoin with a paper claim on it while tokenizing traditional products for exposure. Meanwhile the original demand is growing: privacy concerns are rising, fiat currencies keep failing around the world, and financial markets in many places look fragile.'
			},
			tracksTitle: 'Three markets to preserve and extend',
			tracks: [
				{
					n: '01',
					title: 'Decentralized block production',
					text: 'Proof of Work is already a peer-to-peer market: anyone may generate a block. Ergo launched with weak non-outsourceability to prevent pool formation; it had drawbacks and pooling appeared anyway. Lithos now approaches the same goal through share proofs and collateral contracts, with new markets forming around mining itself. Testnet.'
				},
				{
					n: '02',
					title: 'Peer-to-peer on- and off-ramps',
					text: 'Existing p2p ramp markets for ERG, Bitcoin and Monero are limited by counterparty risk. Trust-minimized insurance would democratize them substantially — the subject of ErgoRich’s Ergo Darkpaper and of ongoing ErgoForum work on Bitcoin on-ramping insurance.'
				},
				{
					n: '03',
					title: 'Peer-to-peer mutual credit',
					text: 'Basis: credit created on trust between people who need know nothing about Ergo or blockchains, with on-chain assets used only to reduce trust. The most direct expression of the thesis.'
				}
			],
			supportTitle: 'What makes all of it work better',
			supportBody:
				'Privacy tooling throughout — the mixing protocol, stealth addresses. Rosen for cross-chaining. The stated priority is <strong>useful products for people outside Ergo, or outside crypto entirely</strong>, with Ergo as the working horse underneath. Next on the list: more DeFi tooling, concentrated liquidity pools, larger-scale mixers.',
			cards: [
				{
					title: 'Roadmaps, reconsidered',
					text: 'Around 2019–20, when the ecosystem was smaller and more centralized, it had roadmaps; they were dropped as a poor fit for a growing community. The proposal now is something roadmap-shaped but different in purpose — a central object for dialogue, for checking progress, and for security and other cross-checks in broad context. Not a plan handed down.'
				},
				{
					title: 'A development culture worth noting',
					text: 'kushti singles out something happening in Ergo developer circles: LLM agents are being used to harden core protocol implementation and ecosystem smart contracts, through constant discussion among humans combined with model cross-checks. A good deal of infrastructure has shipped this way recently.'
				}
			]
		},

		economics: {
			eyebrow: 'Economics',
			title: 'A known supply, distributed through mining.',
			intro:
				'Mainnet launched on 1 July 2019. ERG had no ICO, no VC allocation and no conventional premine; the Foundation treasury receives 4.43% of total emission through a transparent vesting contract.',
			stats: [
				{ value: '97.739M', label: 'maximum scheduled ERG supply' },
				{ value: '4.43%', label: 'Foundation treasury share' },
				{ value: '4 years', label: 'storage-rent horizon' },
				{ value: 'EIP-27', label: 'emission extension soft fork' }
			],
			body: 'Babel fees let a user acquire the ERG needed for miner fees atomically from a liquidity box while paying the provider in another token. The protocol fee is still paid in ERG; no consensus fork was required.'
		},

		applications: {
			eyebrow: 'Applications',
			title: 'Financial primitives already running on-chain.',
			intro:
				'Ergo’s design is visible in deployed systems — not every proposal is a finished product, and each carries its own smart-contract, liquidity and bridge risks.',
			cards: [
				{
					title: 'Oracle Pools',
					text: 'Multiple oracle participants publish data and aggregate it on-chain. Data inputs let downstream contracts read a datapoint without consuming the oracle box.',
					link: 'https://docs.ergoplatform.com/eco/oracle-pools/'
				},
				{
					title: 'Rosen Bridge',
					text: 'A cross-chain bridge architecture using watchers and guards, with Ergo as its coordination layer. Supported routes and security status should always be checked in the live app.',
					link: 'https://rosen.tech/'
				},
				{
					title: 'Spectrum',
					text: 'A non-custodial exchange built around eUTXO contracts, with AMM and order-book work across the ecosystem.',
					link: 'https://spectrum.fi/'
				},
				{
					title: 'ErgoMixer / SigmaJoin',
					text: 'Non-custodial privacy protocols based on Sigma proofs. Privacy depends on correct use, anonymity-set conditions and current software status.',
					link: 'https://docs.ergoplatform.com/eco/ergomixer/'
				},
				{
					title: 'Auction House & NFTs',
					text: 'Native tokens and box registers support auctions, royalties, metadata and minting without requiring a token contract for every asset.',
					link: 'https://ergoauctions.org/'
				},
				{
					title: 'Lithos',
					text: 'Decentralized mining-pool infrastructure using Non-Interactive Share Proofs and collateral contracts. Currently testnet software requiring a fully synced node.',
					link: 'https://docs.ergoplatform.com/eco/lithos/'
				}
			]
		},

		community: {
			eyebrow: 'From ErgoForum',
			title: 'A laboratory for programmable economics.',
			intro:
				'The community explores designs in public. These are research threads and proposals, not claims that every system is deployed.',
			cards: [
				{
					title: 'Scaling Ergo',
					text: 'Stateless validation, transaction chains, off-chain protocols, sidechains and sub-block research.',
					link: 'https://www.ergoforum.org/t/a-scalability-plan-for-ergo/226'
				},
				{
					title: 'Oracle governance',
					text: 'How oracle pools and reserve protocols can update participants and parameters without a central operator.',
					link: 'https://www.ergoforum.org/t/governance-for-oracle-pools-and-the-sigmausd-bank/786'
				},
				{
					title: 'Crowdfunding',
					text: 'Small ErgoScript contracts can enforce all-or-refund funding conditions directly in the UTXO graph.',
					link: 'https://www.ergoforum.org/t/simple-crowdfunding/70'
				},
				{
					title: 'LETS & local credit',
					text: 'Local exchange trading systems explore mutual credit and community accounting rather than speculative token issuance.',
					link: 'https://www.ergoforum.org/t/lets-discussion-summary/3492'
				},
				{
					title: 'Agorism',
					text: 'Permissionless trade, peaceful counter-economics and censorship-resistant tools form an explicit part of Ergo’s social conversation.',
					link: 'https://www.ergoforum.org/t/please-provide-ideas-on-agorism-and-peaceful-counter-economics/3515'
				},
				{
					title: 'Distributed signatures',
					text: 'Threshold and distributed signing research builds on the composability of native Sigma propositions.',
					link: 'https://www.ergoforum.org/t/improved-distributed-signatures/366'
				}
			]
		},

		mission: {
			eyebrow: 'Why Ergo exists',
			title: 'Tools for people at the edges of the financial system.',
			body: 'Ergo’s manifesto frames the platform around permissionless, survivable financial contracts: open participation, resistance to censorship, privacy where needed, and value controlled by users rather than gatekeepers. The aim is not “blockchain for everything”; it is robust contractual money.',
			links: [
				{ label: 'Read the Ergo Manifesto', href: 'https://ergoplatform.org/en/blog/2021-04-26-the-ergo-manifesto/' },
				{ label: 'Join ErgoForum', href: 'https://www.ergoforum.org/' }
			]
		},

		sources: {
			eyebrow: 'Verify, don’t trust',
			title: 'Primary sources',
			body: 'This site separates protocol facts from ecosystem claims, and shipped software from research. Start with the specification and improvement proposals; product availability and parameters can change.',
			links: [
				{ label: 'Official documentation', href: 'https://docs.ergoplatform.com/' },
				{ label: 'Ergo node source', href: 'https://github.com/ergoplatform/ergo' },
				{ label: 'Ergo Improvement Proposals', href: 'https://github.com/ergoplatform/eips' },
				{ label: 'Storage rent', href: 'https://docs.ergoplatform.com/mining/rent/' },
				{ label: 'Stablecoins', href: 'https://docs.ergoplatform.com/uses/stablecoins/' },
				{ label: 'ChainCash', href: 'https://docs.ergoplatform.com/uses/chaincash/' },
				{ label: 'ErgoForum', href: 'https://www.ergoforum.org/top' }
			]
		}
	}
};
