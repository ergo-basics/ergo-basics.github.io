export default {
	common: { toTop: '↑ Top', backToTop: 'Back to top', languageLabel: 'Language', switchLanguage: 'Change language', toc: { nav: 'Section navigation', title: 'On this page', open: 'Open section menu', close: 'Close section menu' } },
	theme: { toLight: 'Switch to light theme', toDark: 'Switch to dark theme', toggle: 'Toggle theme' },
	topbar: { nav: 'Ergo sections', links: { technology: { label: 'Technology', short: 'Tech' }, economics: { label: 'Economics', short: 'Economy' }, applications: { label: 'Applications', short: 'Apps' }, mission: { label: 'Mission', short: 'Mission' } } },
	home: {
		hero: { eyebrow: 'Programmable money, built from first principles', title: 'Ergo is a blockchain for contractual money.', body: 'Bitcoin-inspired security, expressive eUTXO contracts and privacy-preserving proofs — engineered for useful finance without trusted intermediaries.', primary: 'Understand the technology', secondary: 'Explore the ecosystem', note: 'Proof of Work · launched 1 July 2019 · no ICO · no VC allocation' },
		index: { sections: { foundations: 'Foundations', boxes: 'Boxes', proofs: 'Proofs', sustainability: 'Sustainability', economics: 'Economics', applications: 'Applications', community: 'Ideas', mission: 'Mission', sources: 'Sources' } },
		foundations: { eyebrow: 'The foundation', title: 'Conservative consensus. Modern contracts.', intro: 'Ergo starts with the battle-tested UTXO and Proof-of-Work ideas, then extends them deliberately — without turning validation into an open-ended computation.', cards: [
			{ title: 'Extended UTXO', text: 'State lives in discrete boxes, not a shared global account. A transaction declares exactly which boxes it consumes, making dependencies explicit and validation locally predictable.' },
			{ title: 'ErgoScript', text: 'A typed, deterministic language for spending conditions. Each script is bounded; long-running computation is expressed as auditable sequences of transactions — multi-stage contracts.' },
			{ title: 'Autolykos v2', text: 'A memory-hard Proof-of-Work algorithm designed for commodity GPUs. Its original non-outsourceability goal was removed in v2 after contract-based workarounds made pool resistance impractical.' }
		] },
		boxes: { eyebrow: 'The eUTXO model', title: 'A box can carry value, tokens, data and logic.', intro: 'Every unspent output is an Ergo box. Mandatory registers R0–R3 hold value, guarding script, tokens and creation metadata; optional densely-packed R4–R9 hold typed application data.', points: [
			{ n: '01', title: 'Native assets', text: 'Tokens are first-class box contents rather than balances maintained by a separate smart contract.' },
			{ n: '02', title: 'Data inputs', text: 'A transaction can read a box without consuming it. Many transactions can reference the same oracle state without fighting to spend it.' },
			{ n: '03', title: 'Local reasoning', text: 'A contract validates from declared inputs, outputs and context. Independent boxes can be processed concurrently; a hot shared box still creates contention.' },
			{ n: '04', title: 'Off-chain assembly', text: 'Users build the transaction off-chain; miners verify a bounded proof. Computation need not become permanent global execution.' }
		] },
		proofs: { eyebrow: 'Programmable authorization', title: 'Prove the condition — reveal only what is necessary.', intro: 'ErgoScript composes Sigma propositions: discrete-logarithm knowledge proofs joined with AND, OR and threshold logic. This supports multisignatures, ring-style authorization and zero-knowledge protocols at the language level.', quote: 'A script is not an unlimited virtual machine. Expressiveness emerges across transactions, while each validation remains finite and costed.', cards: [
			{ title: 'Sigma protocols', text: 'Non-interactive proofs authorize spending without exposing the witness. Threshold policies can require k-of-n participants.' },
			{ title: 'Multi-stage contracts', text: 'A box encodes one protocol state; spending it creates the next. Chaining these state transitions can express general computation without unbounded work inside one block.' },
			{ title: 'NIPoPoWs', text: 'Compact proofs summarize accumulated Proof of Work for light clients and cross-chain protocols. Ergo nodes support NiPoPoW bootstrap; integrations vary by product.' }
		] },
		sustainability: { eyebrow: 'Long-term design', title: 'The ledger charges dormant state.', intro: 'A box untouched for four years becomes eligible for storage rent. Under current parameters, miners may collect roughly 0.14 ERG per four-year period for a typical box, proportional to serialized size.', cards: [
			{ title: 'State has a cost', text: 'Rent discourages permanent UTXO bloat and lets abandoned boxes return value to network security instead of occupying state forever.' },
			{ title: 'Post-emission revenue', text: 'Storage rent supplements transaction fees after scheduled block emission declines. It is a mechanism, not a guarantee that miner revenue will be sufficient.' },
			{ title: 'Upgradeable parameters', text: 'Miner voting and header extension fields let compatible rule changes activate as soft forks. EIP-27 used this process to extend emissions.' }
		] },
		economics: { eyebrow: 'Economics', title: 'A known supply, distributed through mining.', intro: 'Mainnet launched on 1 July 2019. ERG had no ICO, no VC allocation and no conventional premine; the Foundation treasury receives 4.43% of total emission through a transparent vesting contract.', stats: [
			{ value: '97.739M', label: 'maximum scheduled ERG supply' },
			{ value: '4.43%', label: 'Foundation treasury share' },
			{ value: '4 years', label: 'storage-rent horizon' },
			{ value: 'EIP-27', label: 'emission extension soft fork' }
		], body: 'Babel fees let a user acquire the ERG needed for miner fees atomically from a liquidity box while paying the provider in another token. The protocol fee is still paid in ERG; no consensus fork was required.' },
		applications: { eyebrow: 'Applications', title: 'Financial primitives already running on-chain.', intro: 'Ergo’s design is visible in deployed systems — not every proposal is a finished product, and each carries its own smart-contract, liquidity and bridge risks.', cards: [
			{ title: 'SigmaUSD', text: 'An AgeUSD-based reserve protocol issuing SigUSD and SigRSV. Its contract constrains reserve-coin and stablecoin operations through reserve-ratio rules; it is overcollateralized, not an algorithmic peg without reserves.', link: 'https://sigmausd.io/' },
			{ title: 'Oracle Pools', text: 'Multiple oracle participants publish data and aggregate it on-chain. Data inputs let downstream contracts read a datapoint without consuming the oracle box.', link: 'https://docs.ergoplatform.com/eco/oracle-pools/' },
			{ title: 'Rosen Bridge', text: 'A cross-chain bridge architecture using watchers and guards, with Ergo as its coordination layer. Supported routes and security status should always be checked in the live app.', link: 'https://rosen.tech/' },
			{ title: 'Spectrum', text: 'A non-custodial exchange built around eUTXO contracts, with AMM and order-book work across the ecosystem.', link: 'https://spectrum.fi/' },
			{ title: 'ErgoMixer / SigmaJoin', text: 'Non-custodial privacy protocols based on Sigma proofs. Privacy depends on correct use, anonymity-set conditions and current software status.', link: 'https://docs.ergoplatform.com/eco/ergomixer/' },
			{ title: 'Auction House & NFTs', text: 'Native tokens and box registers support auctions, royalties, metadata and minting without requiring a token contract for every asset.', link: 'https://ergoauctions.org/' }
		] },
		community: { eyebrow: 'From ErgoForum', title: 'A laboratory for programmable economics.', intro: 'The community explores designs in public. These are research threads and proposals, not claims that every system is deployed.', cards: [
			{ title: 'Scaling Ergo', text: 'Stateless validation, transaction chains, off-chain protocols, sidechains and sub-block research.', link: 'https://www.ergoforum.org/t/a-scalability-plan-for-ergo/226' },
			{ title: 'Dexy stablecoins', text: 'A family of oracle-assisted designs using contraction and expansion mechanics; distinct from SigmaUSD and still implementation-specific.', link: 'https://www.ergoforum.org/t/dexy-usd-simplest-stablecoin-design/1430' },
			{ title: 'Oracle governance', text: 'How oracle pools and reserve protocols can update participants and parameters without a central operator.', link: 'https://www.ergoforum.org/t/governance-for-oracle-pools-and-the-sigmausd-bank/786' },
			{ title: 'Crowdfunding', text: 'Small ErgoScript contracts can enforce all-or-refund funding conditions directly in the UTXO graph.', link: 'https://www.ergoforum.org/t/simple-crowdfunding/70' },
			{ title: 'LETS & local credit', text: 'Local exchange trading systems explore mutual credit and community accounting rather than speculative token issuance.', link: 'https://www.ergoforum.org/t/lets-discussion-summary/3492' },
			{ title: 'Agorism', text: 'Permissionless trade, peaceful counter-economics and censorship-resistant tools form an explicit part of Ergo’s social conversation.', link: 'https://www.ergoforum.org/t/please-provide-ideas-on-agorism-and-peaceful-counter-economics/3515' },
			{ title: 'Distributed signatures', text: 'Threshold and distributed signing research builds on the composability of native Sigma propositions.', link: 'https://www.ergoforum.org/t/improved-distributed-signatures/366' },
			{ title: 'Autonomous machines', text: 'Auction-based emission, perpetual tokens and artificial economic agents probe what self-maintaining contracts can do.', link: 'https://www.ergoforum.org/t/auction-coin-auction-based-emission-and-degen-finance-autonomous-machine/4287' }
		] },
		mission: { eyebrow: 'Why Ergo exists', title: 'Tools for people at the edges of the financial system.', body: 'Ergo’s manifesto frames the platform around permissionless, survivable financial contracts: open participation, resistance to censorship, privacy where needed, and value controlled by users rather than gatekeepers. The aim is not “blockchain for everything”; it is robust contractual money.', links: [ { label: 'Read the Ergo Manifesto', href: 'https://ergoplatform.org/en/blog/2021-04-26-the-ergo-manifesto/' }, { label: 'Join ErgoForum', href: 'https://www.ergoforum.org/' } ] },
		sources: { eyebrow: 'Verify, don’t trust', title: 'Primary sources', body: 'This site separates protocol facts from ecosystem claims. Start with the specification and improvement proposals; product availability and parameters can change.', links: [ { label: 'Official documentation', href: 'https://docs.ergoplatform.com/' }, { label: 'Ergo node source', href: 'https://github.com/ergoplatform/ergo' }, { label: 'Ergo Improvement Proposals', href: 'https://github.com/ergoplatform/eips' }, { label: 'ErgoForum', href: 'https://www.ergoforum.org/top' } ] }
	}
};
