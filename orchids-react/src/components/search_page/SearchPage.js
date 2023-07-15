import React from 'react'
import './SearchPage.scss'

export default function SearchPage() {
  return (
    <div id='search-page'>
      <div className='tag-search'>
        <button>Bài viết</button>
        <button>Câu hỏi</button>
        <button>Người dùng</button>
        <button>Nhóm</button>
      </div>
      <div className='result-search'>
        <TagResult />
        <TagResult />
        <TagResult />
        <TagResult />
      </div>
    </div>
  )
}

function TagResult() {
  return (
    <div className='tag-result'>
    </div>
  )
}
