import React, { useEffect, useState } from 'react'
// import { GetListDonation } from '../FunctionAPI.js';
import './Donate.css'

export default function Donate() {

    const [contributors, setContributors] = useState([]);

    useEffect(() => {
        GetListDonation().then(res => {
            handleData(res);
        });
        const update = setInterval(() => {
            GetListDonation().then(res => {
                handleData(res);
            });
        }, 10000);

        return () => {
            // Cleanup function to clear the interval when the component unmounts
            clearInterval(update);
        };
    }, [])

    async function GetListDonation() {
        return fetch('http://localhost:8000/donation', {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                return data;
            });
    }

    const handleData = (data) => {
        // console.log('data: ', data);
        setContributors(data);
    };

    // Table of contributors
    function Table() {

        function vndFormat(vnd) {
            return parseInt(vnd).toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
        }

        return (
            <table id='donation-table'>
                <thead>
                    <tr className='border'>
                        <th>Time</th>
                        <th>Detail</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {contributors && contributors.map((contributor, index) => (
                        <tr key={index} className='border'>
                            <td>{contributor.time}</td>
                            <td>{contributor.detail}</td>
                            <td>{vndFormat(contributor.vnd)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }



    return (
        <div id='donate-page'>
            <img src="./img/donate.jpg" alt="donate" />
            <h1>❤️ Support me ❤️</h1>
            <br />
            <div id='list-contributors'>
                <h2>Contributors</h2>
                <Table />
            </div>
        </div>
    )
}
