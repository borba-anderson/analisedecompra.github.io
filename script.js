document.addEventListener("DOMContentLoaded", function() {
    const produtos = [];

    const form = document.getElementById('produto-form');
    const tabela = document.getElementById('tabela-produtos').querySelector('tbody');
    const economiaTotalEl = document.getElementById('economia-total');
    const chartCtx = document.getElementById('comparacaoChart').getContext('2d');
    let chart;

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const produto = document.getElementById('nome-produto').value;
        const quantidade = parseInt(document.getElementById('quantidade').value);
        const fornecedorA = document.getElementById('fornecedor1').value;
        const precoA = parseFloat(document.getElementById('preco1').value);
        const fornecedorB = document.getElementById('fornecedor2').value;
        const precoB = parseFloat(document.getElementById('preco2').value);

        if (!validarFormulario(produto, quantidade, precoA, precoB)) {
            return;
        }

        const totalA = quantidade * precoA;
        const totalB = quantidade * precoB;

        const novoProduto = { produto, quantidade, fornecedorA, precoA, totalA, fornecedorB, precoB, totalB };
        produtos.push(novoProduto);

        atualizarTabela();
        atualizarGrafico();
        atualizarEconomia();
        form.reset();
    });

    function validarFormulario(produto, quantidade, precoA, precoB) {
        if (!produto || isNaN(quantidade) || isNaN(precoA) || isNaN(precoB)) {
            alert("Por favor, preencha todos os campos corretamente.");
            return false;
        }
        return true;
    }

    function atualizarTabela() {
        tabela.innerHTML = '';

        produtos.forEach((p, index) => {
            const row = tabela.insertRow(index);
            row.insertCell(0).textContent = p.produto;
            row.insertCell(1).textContent = p.quantidade;
            row.insertCell(2).textContent = p.fornecedorA;
            row.insertCell(3).textContent = p.precoA.toFixed(2);
            row.insertCell(4).textContent = p.totalA.toFixed(2);
            row.insertCell(5).textContent = p.fornecedorB;
            row.insertCell(6).textContent = p.precoB.toFixed(2);
            row.insertCell(7).textContent = p.totalB.toFixed(2);
            row.insertCell(8).textContent = ((p.totalA * 0.1) + p.totalA).toFixed(2);
            row.insertCell(9).textContent = "30 dias";
        });
    }

    function atualizarGrafico() {
        if (chart) {
            chart.destroy();
        }

        const labels = produtos.map(p => p.produto);
        const fornecedorAData = produtos.map(p => p.totalA);
        const fornecedorBData = produtos.map(p => p.totalB);

        chart = new Chart(chartCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: produtos[0].fornecedorA,
                        data: fornecedorAData,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    },
                    {
                        label: produtos[0].fornecedorB,
                        data: fornecedorBData,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#333', /* Texto mais escuro */
                            font: {
                                size: 14, /* Tamanho da fonte */
                                weight: 'bold' /* Peso da fonte */
                            }
                        }
                    },
                    x: {
                        ticks: {
                            color: '#333', /* Texto mais escuro */
                            font: {
                                size: 14, /* Tamanho da fonte */
                                weight: 'bold' /* Peso da fonte */
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#333', /* Texto mais escuro */
                            font: {
                                size: 16, /* Tamanho da fonte */
                                weight: 'bold' /* Peso da fonte */
                            }
                        }
                    }
                }
            }
        });
    }

    function atualizarEconomia() {
        if (produtos.length === 0) {
            economiaTotalEl.textContent = 'Você economizaria: R$ 0.00';
            return;
        }

        let economia = 0;
        produtos.forEach(p => {
            economia += Math.abs(p.totalA - p.totalB);
        });

        economiaTotalEl.textContent = `Você economizaria: R$ ${economia.toFixed(2)}`;
    }

    document.getElementById('salvar-pdf').addEventListener('click', function() {
        const doc = new jsPDF();
        doc.text('Relatório de Comparação de Preços', 10, 10);
        
        let y = 20;
        produtos.forEach(p => {
            doc.text(`Produto: ${p.produto}`, 10, y);
            doc.text(`Fornecedor 1: ${p.fornecedorA} - Preço Unitário: R$ ${p.precoA.toFixed(2)} - Total: R$ ${p.totalA.toFixed(2)}`, 10, y + 10);
            doc.text(`Fornecedor 2: ${p.fornecedorB} - Preço Unitário: R$ ${p.precoB.toFixed(2)} - Total: R$ ${p.totalB.toFixed(2)}`, 10, y + 20);
            y += 30;
        });

        doc.text(economiaTotalEl.textContent, 10, y + 10);

        const canvas = document.getElementById('comparacaoChart');
        const canvasImg = canvas.toDataURL("image/jpeg", 1.0);
        doc.addPage();
        doc.addImage(canvasImg, 'JPEG', 10, 10, 180, 160);

        doc.save('relatorio_comparacao.pdf');
    });

    document.getElementById('btn-attach1').addEventListener('click', function() {
        document.getElementById('input-pdf1').click();
    });

    document.getElementById('btn-attach2').addEventListener('click', function() {
        document.getElementById('input-pdf2').click();
    });

    document.getElementById('input-pdf1').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file && file.type === "application/pdf") {
            console.log("PDF do Fornecedor 1 anexado.");
        } else {
            alert("Por favor, anexe um arquivo PDF.");
        }
    });

    document.getElementById('input-pdf2').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file && file.type === "application/pdf") {
            console.log("PDF do Fornecedor 2 anexado.");
        } else {
            alert("Por favor, anexe um arquivo PDF.");
        }
    });
});
