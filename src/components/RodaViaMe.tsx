import { useRef, useState } from "react";

// Estrutura das 6 virtudes com suas forças de caráter
const VIRTUDES = [
  {
    nome: "SABEDORIA E CONHECIMENTO",
    cor: "#B3E5FC", // Azul claro/Ciano pastel
    forcas: [
      "Criatividade",
      "Curiosidade",
      "Pensamento Crítico",
      "Amor ao Aprendizado",
      "Perspectiva",
    ],
  },
  {
    nome: "CORAGEM",
    cor: "#FFF9C4", // Amarelo/Dourado pastel
    forcas: [
      "Heroísmo e Bravura",
      "Perseverança",
      "Autenticidade",
      "Vitalidade",
    ],
  },
  {
    nome: "HUMANIDADE",
    cor: "#F8BBD0", // Rosa/Vermelho claro pastel
    forcas: ["Amor", "Generosidade", "Inteligência Social"],
  },
  {
    nome: "JUSTIÇA",
    cor: "#FFE0B2", // Laranja/Pêssego pastel
    forcas: ["Trabalho em Equipe", "Liderança", "Justiça/Equidade"],
  },
  {
    nome: "TEMPERANÇA",
    cor: "#C8E6C9", // Verde pastel
    forcas: ["Perdão", "Humildade", "Prudência", "Autocontrole"],
  },
  {
    nome: "TRANSCENDÊNCIA",
    cor: "#E1BEE7", // Roxo/Lilás pastel
    forcas: [
      "Apreciação da Beleza",
      "Gratidão",
      "Esperança",
      "Humor",
      "Espiritualidade",
    ],
  },
] as const;

// Flatten para obter as 24 forças em ordem
const FORCAS_ORDENADAS = VIRTUDES.flatMap((v) => v.forcas);

type RodaViaProps = {
  valores: number[]; // Array de 24 números (1-10) representando cada força
  tamanho?: number;
  mostrarNumeros?: boolean;
};

export function RodaViaMe({
  valores = Array(24).fill(5),
  tamanho = 800,
  mostrarNumeros = true,
}: RodaViaProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const centerX = tamanho / 2;
  const centerY = tamanho / 2;
  const raioMaximo = tamanho * 0.35; // Raio da pontuação 10
  const raioMinimo = tamanho * 0.08; // Raio do centro (pontuação 1)
  const raioLabels = raioMaximo + 45; // Raio para posicionar nomes das forças
  const raioVirtudes = raioLabels + 55; // Raio para os arcos de virtudes

  const grausPerSetor = 360 / 24; // 15 graus por setor
  const anguloInicial = -90; // Começar no topo

  // Função para converter graus em radianos
  const grausParaRad = (graus: number) => (graus * Math.PI) / 180;

  // Função para calcular raio baseado no nível (1-10)
  const calcularRaio = (nivel: number) => {
    return raioMinimo + ((raioMaximo - raioMinimo) * (nivel - 1)) / 9;
  };

  // Renderizar grades concêntricas (círculos de 1 a 10)
  const renderGrades = () => {
    return Array.from({ length: 10 }, (_, i) => {
      const nivel = i + 1;
      const raio = calcularRaio(nivel);
      return (
        <circle
          key={`grade-${nivel}`}
          cx={centerX}
          cy={centerY}
          r={raio}
          fill="none"
          stroke="#e0e0e0"
          strokeWidth="1"
          opacity="0.5"
        />
      );
    });
  };

  // Renderizar linhas radiais (divisões dos 24 setores)
  const renderLinhasRadiais = () => {
    return Array.from({ length: 24 }, (_, i) => {
      const angulo = anguloInicial + i * grausPerSetor;
      const rad = grausParaRad(angulo);
      const x1 = centerX + raioMinimo * Math.cos(rad);
      const y1 = centerY + raioMinimo * Math.sin(rad);
      const x2 = centerX + raioMaximo * Math.cos(rad);
      const y2 = centerY + raioMaximo * Math.sin(rad);

      return (
        <line
          key={`linha-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#e0e0e0"
          strokeWidth="1"
          opacity="0.5"
        />
      );
    });
  };

  // Renderizar números de nível dentro de cada setor
  const renderNumeros = () => {
    if (!mostrarNumeros) return null;

    const numerosElements: JSX.Element[] = [];
    const setoresParaMostrar = [0, 6, 12, 18]; // Mostrar números em 4 setores espaçados

    setoresParaMostrar.forEach((setorIdx) => {
      const angulo = anguloInicial + setorIdx * grausPerSetor + grausPerSetor / 2;
      const rad = grausParaRad(angulo);

      // Mostrar apenas alguns níveis para não poluir
      [2, 4, 6, 8, 10].forEach((nivel) => {
        const raio = calcularRaio(nivel);
        const x = centerX + raio * Math.cos(rad);
        const y = centerY + raio * Math.sin(rad);

        numerosElements.push(
          <text
            key={`num-${setorIdx}-${nivel}`}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="9"
            fill="#999"
            opacity="0.6"
          >
            {nivel}
          </text>
        );
      });
    });

    return numerosElements;
  };

  // Renderizar o polígono de valores (conectando os pontos das 24 forças)
  const renderPoligonoValores = () => {
    const pontos = valores.map((valor, i) => {
      const angulo = anguloInicial + i * grausPerSetor + grausPerSetor / 2;
      const rad = grausParaRad(angulo);
      const raio = calcularRaio(Math.max(1, Math.min(10, valor)));
      const x = centerX + raio * Math.cos(rad);
      const y = centerY + raio * Math.sin(rad);
      return `${x},${y}`;
    });

    return (
      <>
        <polygon
          points={pontos.join(" ")}
          fill="rgba(99, 102, 241, 0.2)"
          stroke="rgb(99, 102, 241)"
          strokeWidth="2"
        />
        {valores.map((valor, i) => {
          const angulo = anguloInicial + i * grausPerSetor + grausPerSetor / 2;
          const rad = grausParaRad(angulo);
          const raio = calcularRaio(Math.max(1, Math.min(10, valor)));
          const x = centerX + raio * Math.cos(rad);
          const y = centerY + raio * Math.sin(rad);
          return (
            <circle
              key={`ponto-${i}`}
              cx={x}
              cy={y}
              r="4"
              fill="rgb(99, 102, 241)"
              stroke="white"
              strokeWidth="1.5"
            />
          );
        })}
      </>
    );
  };

  // Renderizar nomes das forças ao redor da roda
  const renderNomesForcas = () => {
    return FORCAS_ORDENADAS.map((forca, i) => {
      const angulo = anguloInicial + i * grausPerSetor + grausPerSetor / 2;
      const rad = grausParaRad(angulo);
      const x = centerX + raioLabels * Math.cos(rad);
      const y = centerY + raioLabels * Math.sin(rad);

      // Calcular rotação para o texto ficar radial
      let rotacao = angulo + 90;
      // Inverter texto se estiver na metade inferior para facilitar leitura
      if (angulo > 0 && angulo < 180) {
        rotacao += 180;
      }

      return (
        <text
          key={`forca-${i}`}
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="10"
          fontWeight="500"
          fill="#333"
          transform={`rotate(${rotacao}, ${x}, ${y})`}
        >
          {forca}
        </text>
      );
    });
  };

  // Renderizar arcos das virtudes na borda externa
  const renderArcosVirtudes = () => {
    let forcasAcumuladas = 0;
    return VIRTUDES.map((virtude, vIdx) => {
      const numForcas = virtude.forcas.length;
      const anguloInicio = anguloInicial + forcasAcumuladas * grausPerSetor;
      const anguloFim = anguloInicio + numForcas * grausPerSetor;

      forcasAcumuladas += numForcas;

      // Calcular path do arco
      const radInicio = grausParaRad(anguloInicio);
      const radFim = grausParaRad(anguloFim);
      const raioArco = raioVirtudes;
      const espessuraArco = 30;

      const x1Externo = centerX + raioArco * Math.cos(radInicio);
      const y1Externo = centerY + raioArco * Math.sin(radInicio);
      const x2Externo = centerX + raioArco * Math.cos(radFim);
      const y2Externo = centerY + raioArco * Math.sin(radFim);

      const raioInterno = raioArco - espessuraArco;
      const x1Interno = centerX + raioInterno * Math.cos(radInicio);
      const y1Interno = centerY + raioInterno * Math.sin(radInicio);
      const x2Interno = centerX + raioInterno * Math.cos(radFim);
      const y2Interno = centerY + raioInterno * Math.sin(radFim);

      const largeArc = numForcas * grausPerSetor > 180 ? 1 : 0;

      const pathData = `
        M ${x1Externo} ${y1Externo}
        A ${raioArco} ${raioArco} 0 ${largeArc} 1 ${x2Externo} ${y2Externo}
        L ${x2Interno} ${y2Interno}
        A ${raioInterno} ${raioInterno} 0 ${largeArc} 0 ${x1Interno} ${y1Interno}
        Z
      `;

      // Posicionar texto no meio do arco
      const anguloMeio = (anguloInicio + anguloFim) / 2;
      const radMeio = grausParaRad(anguloMeio);
      const raioTexto = raioArco - espessuraArco / 2;
      const xTexto = centerX + raioTexto * Math.cos(radMeio);
      const yTexto = centerY + raioTexto * Math.sin(radMeio);

      let rotacaoTexto = anguloMeio + 90;
      if (anguloMeio > 0 && anguloMeio < 180) {
        rotacaoTexto += 180;
      }

      return (
        <g key={`virtude-${vIdx}`}>
          <path d={pathData} fill={virtude.cor} stroke="#fff" strokeWidth="2" />
          <text
            x={xTexto}
            y={yTexto}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="11"
            fontWeight="600"
            fill="#333"
            transform={`rotate(${rotacaoTexto}, ${xTexto}, ${yTexto})`}
          >
            {virtude.nome}
          </text>
        </g>
      );
    });
  };

  return (
    <svg
      ref={svgRef}
      width={tamanho}
      height={tamanho}
      viewBox={`0 0 ${tamanho} ${tamanho}`}
      className="roda-via-me"
      style={{ maxWidth: "100%", height: "auto" }}
    >
      {/* Fundo branco */}
      <rect width={tamanho} height={tamanho} fill="white" />

      {/* Grades concêntricas */}
      {renderGrades()}

      {/* Linhas radiais */}
      {renderLinhasRadiais()}

      {/* Números de nível */}
      {renderNumeros()}

      {/* Polígono de valores */}
      {renderPoligonoValores()}

      {/* Nomes das forças */}
      {renderNomesForcas()}

      {/* Arcos das virtudes */}
      {renderArcosVirtudes()}

      {/* Círculo central decorativo */}
      <circle
        cx={centerX}
        cy={centerY}
        r={raioMinimo}
        fill="white"
        stroke="#ccc"
        strokeWidth="1"
      />
    </svg>
  );
}

// Hook para facilitar o uso com valores editáveis
export function useRodaViaMe(valoresIniciais?: number[]) {
  const [valores, setValores] = useState<number[]>(
    valoresIniciais || Array(24).fill(5)
  );

  const atualizarValor = (indice: number, novoValor: number) => {
    setValores((prev) => {
      const novos = [...prev];
      novos[indice] = Math.max(1, Math.min(10, novoValor));
      return novos;
    });
  };

  return { valores, setValores, atualizarValor, forcas: FORCAS_ORDENADAS };
}

// Exportar também a estrutura de virtudes para uso em formulários
export { VIRTUDES, FORCAS_ORDENADAS };
