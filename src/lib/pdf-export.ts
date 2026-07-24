import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function convertSvgToPngDataUrl(
  containerOrSvg: HTMLElement | SVGSVGElement
): Promise<{ dataUrl: string; width: number; height: number }> {
  const svgElement =
    containerOrSvg instanceof SVGSVGElement
      ? containerOrSvg
      : containerOrSvg.querySelector("svg");

  if (!svgElement) {
    const canvas = await html2canvas(containerOrSvg, {
      backgroundColor: "#ffffff",
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
    });
    return {
      dataUrl: canvas.toDataURL("image/png"),
      width: canvas.width,
      height: canvas.height,
    };
  }

  const clone = svgElement.cloneNode(true) as SVGSVGElement;

  const width =
    svgElement.viewBox?.baseVal?.width ||
    svgElement.width?.baseVal?.value ||
    svgElement.clientWidth ||
    800;
  const height =
    svgElement.viewBox?.baseVal?.height ||
    svgElement.height?.baseVal?.value ||
    svgElement.clientHeight ||
    800;

  clone.setAttribute("width", width.toString());
  clone.setAttribute("height", height.toString());
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  const svgString = new XMLSerializer()
    .serializeToString(clone)
    .replace(/var\(--border\)/g, "#e2e8f0")
    .replace(/var\(--foreground\)/g, "#0f172a")
    .replace(/var\(--background\)/g, "#ffffff")
    .replace(/var\(--muted-foreground\)/g, "#64748b");

  const svgBlob = new Blob([svgString], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = 2;
      const canvas = document.createElement("canvas");
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Não foi possível obter contexto 2D"));
        return;
      }
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve({
        dataUrl: canvas.toDataURL("image/png"),
        width: canvas.width,
        height: canvas.height,
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      html2canvas(containerOrSvg, {
        backgroundColor: "#ffffff",
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      })
        .then((canvas) => {
          resolve({
            dataUrl: canvas.toDataURL("image/png"),
            width: canvas.width,
            height: canvas.height,
          });
        })
        .catch(reject);
    };
    img.src = url;
  });
}
