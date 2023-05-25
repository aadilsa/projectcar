import React, { useEffect, useState } from 'react';
import Container from '../../Component/container';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import ReactPaginate from 'react-paginate';
import Form from 'react-bootstrap/Form';

import { Table } from 'react-bootstrap';
import axios from 'axios';

const Dashboard = () => {
    const [data, setdata] = useState([])
    const [pagedata, setpagedata] = useState(0)
    const [searchdata, setsearchdata] = useState("")
    let token = localStorage.getItem("logintoken")
    console.log(searchdata)
    useEffect(() => {
        AdminProfile();
    }, []);


    const AdminProfile = () => {
        axios(
            {
                url: `https://tgu90.com:8000/admin/service_providers_list?pageSize=5&pageNumber=${1}`,
                method: "get",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        ).then((response) => {
            const Count = response.data.data.count;
            const rows = response.data.data.rows
            setdata(rows)
            setpagedata(Math.ceil(Count / 5))
            console.log(Count, "count")
            console.log(response, "responce")
        })
            .catch((err) => {
                console.log(err);
            })
    }


    const fecthComments = async (CurrentPage) => {
        const res = await fetch(`https://tgu90.com:8000/admin/service_providers_list?pageSize=5&pageNumber=${CurrentPage}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
        );
        const data = await res.json();
        console.log(data)
        const mydata = data.data.rows;
        return mydata;
    }

    const Click = async (mydata) => {
        window.scrollTo(0, 0);
        var CurrentPage = mydata.selected + 1;
        const Comments = await fecthComments(CurrentPage);
        setdata(Comments)
    };

    const keys = ["full_name", "email", "phone_num", "address", "city", "state"]
    return (
        <Container>
            <table>
                <tr>
                    <th className=''><h1>Dashboard</h1></th>
                </tr>
            </table>
            <table>
                <tr>
                    <td>
                        <Form.Control type="text" placeholder="search..." className='searchinput' onChange={(e) => setsearchdata(e.target.value)} />
                    </td>
                    <td>
                        <ReactPaginate
                            style={{ background: 'red' }}
                            previousLabel={"Previous"}
                            nextLabel={'Next'}
                            breakLabel={"..."}
                            pageCount={pagedata}
                            marginPagesDisplayed={3}
                            pageRangeDisplayed={3}
                            onPageChange={Click}
                            containerClassName={'pagination justify-content-center'}
                            pageClassName={'page-item'}
                            pageLinkClassName={'page-link'}
                            previousClassName={'page-item'}
                            previousLinkClassName={'page-link'}
                            nextClassName={'page-item'}
                            nextLinkClassName={'page-link'}
                            breakClassName={"page-item"}
                            breakLinkClassName={'page-link'}
                            activeClassName={'active'}
                        />
                    </td>
                    <td></td>
                </tr>
            </table>

            <br></br>
            <div className="card-table table-responsive">
                <Table className=" striped bordered hover">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>CUSTOMER NAME</th>
                            <th>ADDRESS</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            data.filter((user) => keys.some((key) => user[key].toLowerCase().includes(searchdata))).map((data, index) => {
                                return (
                                    <>
                                        <tr key={data.id}>
                                            <td>{index + 1}</td>
                                            <td>{data.full_name}<br />{data.email}<br />{data.phone_num}</td>
                                            <td>{data.address}<br />{data.city}<br />{data.state}</td>
                                            <td>
                                                <DropdownButton id="dropdown-basic-button" title="Action">
                                                    <Dropdown.Item href="#/action-1">Edit</Dropdown.Item>
                                                    <Dropdown.Item href="#/action-2">Notification</Dropdown.Item>
                                                    <Dropdown.Item href="#/action-3">Delete</Dropdown.Item>
                                                </DropdownButton>
                                            </td>
                                        </tr>
                                    </>
                                )
                            })
                        }

                    </tbody>
                </Table>
            </div>

        </Container>

    );
}

export default Dashboard;
