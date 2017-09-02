SOLC=solc
S_FLAGS=--optimize --overwrite --abi --bin
CONTRACT_PATH=./contracts
OUTPUT=./compiledContracts

all: puntocitta

puntocitta:
	${SOLC} ${S_FLAGS} ${CONTRACT_PATH}/puntocitta.sol -o ${OUTPUT} 

clean:
	rm -Rf ./compiledContracts
