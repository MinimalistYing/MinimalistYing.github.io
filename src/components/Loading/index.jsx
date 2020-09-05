import React from 'react'
import './index.less'

function Loading() {
	return (
		<div id="init-loading">
      <div class="pac-man-head">
        <div class="pac-man-top">
          <div class="pac-man pac-man-lt" />
          <div class="pac-man pac-man-rt" />
        </div>
        <div class="pac-man-down">
          <div class="pac-man pac-man-ld" />
          <div class="pac-man pac-man-rd" />
        </div>
        <div class="candy first" />
        <div class="candy second" />
        <div class="candy third" />
      </div>
    </div>
	)
}

export default Loading
