/* Encapsulate the editor */
import React, { useState, useEffect } from 'react'
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, EditorState, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import htmlToDraft from 'html-to-draftjs';


export default function Index(props) {
    //receive the content from updatecomponent and render in the page 
    useEffect(() => {
        console.log(props.content)
        const html = props.content
        if (html === undefined) return
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            onEditorStateChange(editorState)
        }
    }, [props.content])

    const [editorState, onEditorStateChange] = useState()
    return (
        <div style={{ width: '80%', margin: '5rem auto' }}>
            <Editor
                editorState={editorState}
                onEditorStateChange={editorState => onEditorStateChange(editorState)}
                onBlur={() => {
                    props.getEditor(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                }}
            />
        </div>
    )
}
