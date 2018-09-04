import React, { Component } from 'react';
import AWS from 'aws-sdk';
import './text-convert.css';


var testFilePath = "c:/users/user/desktop/preprocessors.png";

AWS.config.update({
    accessKeyId: "de",
    secretAccessKey: "d",
});

const s3 = new AWS.S3();

//why can't i use this as jsx element?
function textboxp() { return (<p>herllo</p>); }


class Textconvert extends Component {

    constructor(props) {
        super(props);

        this.state = {

            currentImage: {},
            fileName: 'testing',

        }

        this.previewImage = this.previewImage.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.uploadImage2 = this.uploadImage2.bind(this);


    }



    render() {

        return (

            <div className='container'>


                <div className="row">
                    <div className="col-md-12">
                        <input id="imageUpload" type="file" accept=".jpeg, .jpg, .png" onChange={this.previewImage}></input>
                        <button onClick={this.uploadImage2}>Convert</button>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <img width='50%' src='' />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12" id="textContainer">

                    </div>
                </div>






            </div>

        )
    }



    //called when input is changed, i.e. an image is chosen 
    previewImage() {

        var file = document.querySelector('#imageUpload');
        var filename = file.files[0].name;
        var fileobj = file.files[0];

        this.setState({
            currentImage: fileobj,
            fileName: filename
        })


        var fileobjurl = URL.createObjectURL(fileobj);
        var imgElement = document.querySelector('img');
        imgElement.src = fileobjurl;

        var textBox =  document.querySelector('#textContainer');
        while (textBox.firstChild) {
            textBox.removeChild(textBox.firstChild);
        }

    }



    //uses fetch API
    uploadImage2() {

        var that = this;

        var fileobj = this.state.currentImage;
        var fd = new FormData();
        var imgElement = document.querySelector('img');

        fd.append('image', fileobj, this.state.fileName);

        fetch('http://localhost:8000/upload', {
            method: 'post',
            body: fd


        }).then(function (response) {
            return response.json();
        }).then(function (data) {

            console.log(data);
            // that.setState({ detectedText: data });
            // console.log(that.state.detectedText);

            var dText= document.querySelector('#dText');
            var textDiv = document.querySelector('#textContainer');
            for(let line of data){

                console.log("line of data: ", line);


                var newP = document.createElement('p');
                var pText = document.createTextNode(line);
                newP.appendChild(pText);



                textDiv.appendChild(newP);





            }
            


        });

    }

    //uses XMLHTTP to make a post request
    uploadImage() {

        var file = document.querySelector('#imageUpload');
        var filename = file.files[0].name;
        var fileobj = file.files[0];
        var fd = new FormData();
        fd.append('image', fileobj, filename);

        this.setState({
            fileName: filename
        })

        var request = new XMLHttpRequest();
        request.open('POST', 'http://localhost:8000/upload');
        // request.setRequestHeader("Content-Type", "multipart/form-data");
        request.send(fd);




    }




}

export default Textconvert;