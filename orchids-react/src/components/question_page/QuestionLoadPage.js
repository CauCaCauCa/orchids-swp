import React, { useEffect } from 'react'
import PopupShowCard from './PopupShowCard';
import { GetQuestionByID } from '../../api/questionAPI';
import { GetListUsernameByEmails, GetPersonalInfo } from '../../api/accountAPI';

export default function QuestionLoadPage() {
    const [question, setQuestion] = React.useState(null);//[question, setQuestion

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        window.scrollTo(0, 0);
        const id = urlParams.get('id');
        var result = {}
        GetQuestionByID(id).then(res => {
            console.log(res);
            // get user info comment
            var list = [];
            res.answers.forEach(element => {
                list.push(element.emailCreator);
            })
            GetListUsernameByEmails(list).then(data => {
                console.log(data);
                    res.answers.map((item, index) => {
                        item.avatar = data.find(x => x.email === item.emailCreator).avatar;
                        item.username = data.find(x => x.email === item.emailCreator).username;
                    })
            }).then(() => {
                setQuestion(res);
            })
        })

    }, []);


    return (
        <>
            {
                question && question.avatar &&
                < PopupShowCard qcard={question} />
            }
        </>
    )
}
