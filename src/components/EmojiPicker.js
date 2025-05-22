import React from 'react';

const EMOJI_LIST = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
  '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
  '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
  '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
  '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
  '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
  '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯',
  '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐',
  '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '💩'
];

const EmojiPicker = ({ onEmojiSelect, theme }) => {
  return (
    <div
      style={{
        width: '300px',
        maxHeight: '300px',
        overflowY: 'auto',
        backgroundColor: theme === 'dark' ? '#333' : '#fff',
        padding: '10px',
        borderRadius: '10px',
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gap: '5px'
      }}
    >
      {EMOJI_LIST.map((emoji, index) => (
        <button
          key={index}
          onClick={() => onEmojiSelect({ native: emoji })}
          style={{
            border: 'none',
            background: 'none',
            fontSize: '24px',
            padding: '5px',
            cursor: 'pointer',
            borderRadius: '5px',
            transition: 'all 0.2s ease',
            color: theme === 'dark' ? '#fff' : '#000',
            '&:hover': {
              backgroundColor: theme === 'dark' ? '#444' : '#f0f0f0'
            }
          }}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default EmojiPicker; 