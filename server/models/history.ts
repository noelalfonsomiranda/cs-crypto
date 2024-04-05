import mongoose from 'mongoose'

interface IHistory {
  title: string;
  description: string;
}

interface todoModelInterface extends mongoose.Model<HistoryDoc> {
  build(attr: IHistory): HistoryDoc
}

interface HistoryDoc extends mongoose.Document {
  title: string;
  description: string;
}

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String, 
    required: true
  }
})

todoSchema.statics.build = (attr: IHistory) => {
  return new Todo(attr)
}

const Todo = mongoose.model<HistoryDoc, todoModelInterface>('Todo', todoSchema)

Todo.build({
  title: 'some title',
  description: 'some description'
})

export { Todo }




