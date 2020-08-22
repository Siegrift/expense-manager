import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { ObjectOf } from '../types'

const useStyles = makeStyles({
  coin: {
    // https://github.com/mui-org/material-ui/issues/13793#issuecomment-512202238
    animation: '$coin-rotation 2s infinite ease-in-out',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  '@keyframes coin-rotation': {
    '0%': {
      transform: 'rotateY(0deg)',
    },
    '100%': {
      transform: 'rotateY(1800deg)',
    },
  },
})

export interface LoadingProps {
  imageStyle?: ObjectOf<string>
  textStyle?: ObjectOf<string>
  size?: number
  text?: string
}

export const Loading: React.FC<LoadingProps> = ({
  imageStyle,
  text,
  size,
  textStyle,
}) => {
  const classes = useStyles()

  return (
    <>
      <img
        src="../static/coin.svg"
        alt="coin"
        style={{ width: `${size}px`, ...imageStyle }}
        className={classes.coin}
      />
      {text && (
        <Typography
          variant="h3"
          gutterBottom
          style={{ textAlign: 'center', ...textStyle }}
        >
          {text}
        </Typography>
      )}
    </>
  )
}

export const LoadingScreen = (props?: LoadingProps) => (
  <Loading
    imageStyle={{ marginTop: '20vh', width: '40vh' }}
    text="Loading..."
    textStyle={{ marginTop: '10vh' }}
    {...props}
  />
)

export const LoadingOverlay = () => {
  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        display: 'flex',
        backgroundColor: `rgba(0,0,0,0.4)`,
      }}
    >
      <Loading size={150} />
    </div>
  )
}

export default Loading
