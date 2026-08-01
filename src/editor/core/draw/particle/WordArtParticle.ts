import { DeepRequired } from '../../../interface/Common'
import { IEditorOption } from '../../../interface/Editor'
import { IElement } from '../../../interface/Element'
import { Draw } from '../Draw'

export class WordArtParticle {
  private options: DeepRequired<IEditorOption>

  constructor(draw: Draw) {
    this.options = draw.getOptions()
  }

  /**
   * 测量艺术字的实际渲染尺寸（未缩放，单位 px）
   */
  public static measureSize(
    text: string,
    font: string,
    size: number
  ): { width: number; height: number } {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    ctx.font = `${size}px ${font}`
    const metrics = ctx.measureText(text)
    const width = Math.ceil(metrics.width) + 2
    // 优先使用 boundingBox，降级为 size * 1.2
    const ascent = metrics.actualBoundingBoxAscent ?? 0
    const descent = metrics.actualBoundingBoxDescent ?? 0
    const height =
      ascent + descent > 0
        ? Math.ceil(ascent + descent) + 2
        : Math.ceil(size * 1.2)
    return { width, height }
  }

  public render(
    ctx: CanvasRenderingContext2D,
    element: IElement,
    x: number,
    y: number
  ) {
    const { scale } = this.options
    const font = element.font || 'SimSun'
    const size = (element.size || 36) * scale
    const color = element.color || '#000000'
    const text = element.value

    ctx.save()
    ctx.font = `${size}px ${font}`
    ctx.fillStyle = color
    ctx.textBaseline = 'top'
    ctx.fillText(text, x, y)
    ctx.restore()
  }
}
