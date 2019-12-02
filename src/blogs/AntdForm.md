# Ant Design 表单的一些进阶使用方式

## `getFieldDecorator` 如何支持嵌套结构
在使用 Ant Design 的表单时，通常我们都希望与后端交互的数据结构尽可能扁平化，这样表单在设值和提交时都会很简单。  
但是难免会碰到这样那样的原因导致数据结构会出现嵌套，其实 `getFieldDecorator` 也是支持这样的数据结构的。  
例如，当后端定义的接口入参形式如下:
```json
{
  "person": {
    "name": "Jack Ma",
    "age": 18
  },
  "education": ["a", "b"]
}
```
假设我们现在的需求是实现一个表单可以修改这些值并提交。  
比较笨的办法是我们自己在前端的时候先当作扁平的数据处理，例如通过
```js
const value = {
  personName: '',
  personAge: 0,
  educationFirst: '',
  educationSecond: ''
}
```
如上数据结构来存储表单的值，在最后发起请求前再将格式转化为后端所需要的嵌套格式。  
很明显，如果使用这种方式的话在表单回填和提交时我们都要多做一步转化操作，不够简洁。  
下面让我们来看看更好的方式
```js
import { Form, Input, Icon, Button, InputNumber } from 'antd'

class App extends React.Component {
  state = {
    value: {
      person: {
        name: 'Jack Ma',
        age: 18
      },
      education: [
        'a',
        'b'
      ]
    }
  }

  componentDidMount () {
    this.props.form.setFieldsValue(this.state.value)
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item label='name'>
          {getFieldDecorator('person.name')(
            <Input />
          )}
        </Form.Item>
        <Form.Item label='age'>
          {getFieldDecorator('person.age')(
            <InputNumber />
          )}
        </Form.Item>
        <Form.Item label='education 1'>
          {getFieldDecorator('education[0]')(
            <Input />
          )}
        </Form.Item>
        <Form.Item label='education 2'>
          {getFieldDecorator('education[1]')(
            <Input />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

const Wrapped = Form.create({ name: 'test' })(App)
ReactDOM.render(<Wrapped />, mountNode)
```
因为 Ant Design 的 `getFieldDecorator` 可以通过 `[]` `.` 支持嵌套式的写法，所以哪怕是类似 `a.b[3].c.d` 这样更复杂的嵌套结构也可以很好的支持。  
在实现需要可以动态增减表单项的表单时，这个技巧尤为好用。

## 如何自定义表单组件并放在 getFieldDecorator 中使用
有时候除了 Ant Design 提供的基础表单组件，我们也需要取实现一些自定义的表单组件。  
当然我们也希望自定义的表单组件也能和基础组件一样被使用。  
```js
function ColorPicker (props) {
  return (
    <div>
      <span
        className={props.value === 'Red' ? 'selected' : ''}
        onClick={() => props.onChange('Red')}
      >Red</span>
      <span
        className={props.value === 'Green' ? 'selected' : ''}
        onClick={() => props.onChange('Green')}
      >Green</span>
    </div>
  )
}
```
如上例，只需要我们在实现受控组件时接受 `value` 作为组件的值，`onChange` 作为值发生改变的函数。  
`getFieldDecorator` 即可替我们接管该受控组件。