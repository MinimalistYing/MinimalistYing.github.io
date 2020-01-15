import React, { Component } from 'react'
import './style.less'
import { Link } from 'react-router-dom'
import blogs, { category } from '@blog'

class Main extends Component {
  state={
    categories: category.map(key => ({
      name: blogs[key].slice(2, blogs[key].indexOf('\n')),
      key
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
                className={this.props.history.location.pathname.endsWith(`${item.key}.html`) ? 'selected' : ''}
              ><Link to={`${item.key}.html`}>{item.name}</Link></li>
            ))
          }
        </ul>
      </main>
    )
  }
}

export default Main
