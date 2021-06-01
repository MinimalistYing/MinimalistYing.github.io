import React, { Component } from 'react'
import './style.less'
import { Link } from 'react-router-dom'
import blogs, { category } from '@blog'

class Main extends Component {
  state={
    categories: category.map(({ key, img }) => ({
      name: blogs[key].slice(2, blogs[key].indexOf('\n')),
      key,
      img,
    }))
  }

  render () {
    return (
      <main className='home'>
        <h1>Blogs</h1>
        <ul className='blogs-category'>
          {
            this.state.categories.map((item, index) => (
                <li
                  id={item.key}
                  key={item.key}
                  onClick={() => this.props.history.push(`${item.key}.html`)}
                  className={this.props.history.location.pathname.endsWith(`${item.key}.html`) ? 'selected' : ''}
                >
                  <figure>
                    <img src={item.img} loading="lazy" />
                    <figcaption>{item.name}</figcaption>
                  </figure>
                </li>
            ))
          }
        </ul>
      </main>
    )
  }
}

export default Main
