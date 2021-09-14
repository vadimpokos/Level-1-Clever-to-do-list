import { db } from '../../firebase/firebase'
import {
  ADD_TODO,
  CLEAR_TODOS,
  DELETE_TODO,
  GET_TODOS,
  UPDATE_TODO,
} from '../../constants/reduxTypes'
import { openNotification } from '../../utils/notification'
import { hideLoading, showLoading } from '../appReducer/actions'

export function getTodos(uid) {
  return async (dispatch) => {
    dispatch(showLoading())
    const response = db.collection('todos').where('uid', '==', uid)
    let todos = []
    try {
      await response
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            todos = [...todos, { ...doc.data(), firestoreId: doc.id }]
          })
        })
        .then(() => {
          dispatch({ type: GET_TODOS, payload: todos })
          dispatch(hideLoading())
        })
        .catch((e) => {
          throw e
        })
    } catch (e) {
      openNotification('error', 'Error loading data', e.message)
    }
  }
}

export function addToDo(title, description, uid, day) {
  return async (dispatch) => {
    const response = db.collection('todos')
    const todo = {
      title: title,
      id: new Date().getTime(),
      description: description,
      uid: uid,
      status: 'inprogress',
      date: day,
    }
    try {
      await response
        .add(todo)
        .then(() => {
          dispatch({ type: ADD_TODO, payload: todo })
        })
        .catch((error) => {
          throw error
        })
    } catch (e) {
      openNotification('error', 'Error adding document', e.message)
    }
  }
}

export function updateToDo(todo, title, description, status) {
  return async (dispatch) => {
    const response = db.collection('todos')
    const newToDo = {
      title: title,
      description: description,
      id: todo.id,
      uid: todo.uid,
      firestoreId: todo.firestoreId,
      status: status,
      date: todo.date,
    }
    try {
      await response
        .doc(todo.firestoreId)
        .update({
          title: title,
          description: description,
          status: status,
        })
        .then(() => {
          dispatch({ type: UPDATE_TODO, payload: newToDo })
        })
        .catch((error) => {
          throw error
        })
    } catch (e) {
      openNotification('error', 'Error updating document', e.message)
    }
  }
}

export function deleteToDo(docId, id) {
  return async (dispatch) => {
    const response = db.collection('todos')
    try {
      await response
        .doc(docId)
        .delete()
        .then(() => {
          openNotification('success', 'Task deleted!')
        })
        .then(() => {
          dispatch({ type: DELETE_TODO, payload: id })
        })
        .catch((error) => {
          throw error
        })
    } catch (e) {
      console.log(e)
      openNotification('error', 'Error removing task!', e.message)
    }
  }
}

export function clearTodoList() {
  return {
    type: CLEAR_TODOS,
    payload: [],
  }
}