//Simple n-bit hash
export function nPearsonHash(message: string, n = 8): number {
	// Ideally, this table would be shuffled...
	// 256 will be the highest value provided by this hashing function
	const table = [...new Array(2 ** n)].map((_, i) => i);


	return message.split('').reduce((hash, c) => {
		return table[(hash + c.charCodeAt(0)) % (table.length - 1)];
	}, message.length % (table.length - 1));

}
