import { ObjectOf } from '../types'
import Typography from '@material-ui/core/Typography'

export interface LoadingProps {
  imageStyle?: ObjectOf<string>
  textStyle?: ObjectOf<string>
  size?: number
  text?: string
}

const Loading = ({ imageStyle, text, size, textStyle }: LoadingProps) => {
  return (
    <>
      <img
        src="../static/coin.svg"
        alt="coin"
        style={{ width: `${size}px`, ...imageStyle }}
      />
      <Typography
        variant="h3"
        gutterBottom
        style={{ textAlign: 'center', marginTop: '10vh', ...textStyle }}
      >
        {text}
      </Typography>

      <style jsx>{`
        @keyframes rotation {
          from {
            transform: rotateY(0deg);
          }
          to {
            transform: rotateY(1800deg);
          }
        }

        img {
          animation: rotation 2s infinite ease-in-out;
          display: block;
          margin-left: auto;
          margin-right: auto;
        }
      `}</style>
    </>
  )
}

export default Loading
