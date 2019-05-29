import { all, fork, takeLatest, put, delay, call } from 'redux-saga/effects';
import axios from 'axios';
import Router from 'next/router'

import {
  ADD_QUESTION_REQUEST,
  ADD_QUESTION_SUCCESS,
  ADD_QUESTION_FAILURE,
  EDIT_QUESTION_REQUEST,
  EDIT_QUESTION_SUCCESS,
  EDIT_QUESTION_FAILURE,
  LOAD_QUESTION_REQUEST,
  LOAD_QUESTION_SUCCESS,
  LOAD_QUESTION_FAILURE,
  LOAD_QUESTIONS_REQUEST,
  LOAD_QUESTIONS_SUCCESS,
  LOAD_QUESTIONS_FAILURE,
  
} from '../reducers/question';

function loadQUESTIONAPI({token, id}) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  return axios.get(`/QUESTIONs/${id}`, config);
}

function* loadQUESTION(action) {
  try {
    const result = yield call(loadQUESTIONAPI, action.data);
    yield put({
      type: LOAD_QUESTION_SUCCESS,
      data: result.data.result,
    });
  } catch (e) {
    yield put({
      type: LOAD_QUESTION_FAILURE,
      error: e,
    });
  }
}

function* watchLoadQUESTION() {
  yield takeLatest(LOAD_QUESTION_REQUEST, loadQUESTION);
}

function loadQuesionsAPI({token}) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  return axios.get(`/questions`, config);
}

function* loadQuesions(action) {
  try {
    const result = yield call(loadQuesionsAPI, action.data);
    yield put({
      type: LOAD_QUESTIONS_SUCCESS,
      data: result.data.result,
    });
  } catch (e) {
    yield put({
      type: LOAD_QUESTIONS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadQuestions() {
  yield takeLatest(LOAD_QUESTIONS_REQUEST, loadQuesions);
}

function editQUESTIONAPI(data) {
  const formData = new FormData();
  formData.append('title', data.title)
  formData.append('content', data.content)
  const config = {
    headers: {
      'content-type': 'multiQUESTION/form-data'
    }
  }
  return axios.put(`/QUESTIONs/${data.id}`, formData, config);
}

function* editQUESTION(action) {
  try {
    const result = yield call(editQUESTIONAPI, action.data);
    yield put({
      type: EDIT_QUESTION_SUCCESS,
    });
    Router.pushRoute(`/QUESTIONs/${action.data.id}`)
  } catch (e) {
    yield put({
      type: EDIT_QUESTION_FAILURE,
      error: e,
    });
  }
}

function* watchEditQUESTION() {
  yield takeLatest(EDIT_QUESTION_REQUEST, editQUESTION);
}


function addQuestionAPI(data) {
  console.log('11111');
  const formData = new FormData();
  formData.append('partId', data.id)
  formData.append('title', data.title)
  formData.append('content', data.content)
  const config = {
    headers: {
      'content-type': 'multipart/form-data'
    }
  }
  return axios.post('/questions', formData, config);
}

function* addQuestion(action) {
  try {
    yield call(addQuestionAPI, action.data);
    yield put({
      type: ADD_QUESTION_SUCCESS,
    });
    Router.pushRoute(`/parts/${action.data.id}`)
  } catch (e) {
    yield put({
      type: ADD_QUESTION_FAILURE,
      error: e,
    });
  }
}

function* watchAddQuestion() {
  yield takeLatest(ADD_QUESTION_REQUEST, addQuestion);
}

export default function* QUESTIONSaga() {
  yield all([
    fork(watchAddQuestion),
    // fork(watchEditQUESTION),
    fork(watchLoadQuestions),
    // fork(watchLoadQUESTION),
  ]);
}
