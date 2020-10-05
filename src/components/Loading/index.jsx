import React from 'react'
import './index.less'

function Loading() {
	return (
		<div id="init-loading">
      <div className="pac-man-head">
        <div className="pac-man-top">
          <div className="pac-man pac-man-lt" />
          <div className="pac-man pac-man-rt" />
        </div>
        <div className="pac-man-down">
          <div className="pac-man pac-man-ld" />
          <div className="pac-man pac-man-rd" />
        </div>
        <div className="candy first" />
        <div className="candy second" />
        <div className="candy third" />
      </div>
    </div>
	)
}

export default Loading
