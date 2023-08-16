class Item {
    constructor(codigo, descricao, valor) {
        this.codigo = codigo;
        this.descricao = descricao;
        this.valor = valor;
    }
}

class ItemPrincipal extends Item {
    constructor(codigo, descricao, valor) {
        super(codigo, descricao, valor);
        this.itensExtras = []; 
    }

    adicionarItemExtra(itemExtra) {
        this.itensExtras.push(itemExtra);
    }
}

class ItemExtra extends Item {
    constructor(codigo, descricao, valor, codigoPrincipal) {
        super (codigo, descricao, valor);
        this.codigoPrincipal = codigoPrincipal;
    }
}

class CaixaDaLanchonete {
    constructor() {
        this.cardapio = [
            new ItemPrincipal ('cafe', 'Café', 3.00),
            new ItemExtra ('chantily', 'Chantily (extra do Café)', 1.50, 'cafe'),
            new ItemPrincipal ('suco', 'Suco Natural', 6.20),
            new ItemPrincipal ('sanduiche', 'Salgado', 6.50),
            new ItemExtra ('queijo', 'Queijo (extra do Sanduíche)', 2.00, 'sanduiche'),
            new ItemPrincipal ('salgado', 'Salgado', 7.25),
            new ItemPrincipal ('combo1', '1 Suco e 1 Sanduíche', 9.50),
            new ItemPrincipal ('combo2', '1 Café e 1 Sanduíche', 7.50)
        ];
    }

    calcularValorDaCompra(formaDePagamento, itens) {
        const formaDePagamentoValidas = ['dinheiro', 'debito', 'credito'];

        if (!formaDePagamentoValidas.includes(formaDePagamento)) {
            return 'Forma de pagamento inválida!';
        }

        const carrinho = [];
        for (const itemInfo of itens) {
            const [codigo, quantidade] = itemInfo.split(',');

            const item = this.cardapio.find(item => item.codigo === codigo);

            if (!item) {
                return 'Item inválido!';
            }

            if (item instanceof ItemExtra) {
                const ItemPrincipalNoCarrinho = carrinho.find(
                    itemCarrinho => itemCarrinho.item.codigo === item.codigoPrincipal
                );
                if (!ItemPrincipalNoCarrinho) {
                    return 'Item extra não pode ser pedido sem o principal';
                }
            }

            carrinho.push({
                item,
                quantidade: parseInt(quantidade)
            });
        }

        if (carrinho.length === 0) {
            return 'Não há itens no carrinho de compra!';
        }
        if (carrinho.some(itemInfo => itemInfo.quantidade === 0)) {
            return 'Quantidade inválida!';
        }

        let total = 0;

        for (const itemInfo of carrinho) {
            total += itemInfo.item.valor * itemInfo.quantidade;
            if (itemInfo.item.itensExtras) {
                for (const itemExtra of itemInfo.item.itensExtras) {
                    total += itemExtra.valor * itemInfo.quantidade;
                }
            }
        }

        if (formaDePagamento === 'dinheiro') {
            total *= 0.95;                                                  // Desconto de 5% para pagamento em dinheiro
        } else if (formaDePagamento === 'credito') {
            total *= 1.03;                                                  // Acréscimo de 3% para pagamento a crédito
        }

        return `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

}

export { CaixaDaLanchonete };