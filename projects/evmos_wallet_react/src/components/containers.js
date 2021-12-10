import React from 'react';

const Image = (props) => {
    return (
        <section style={{
            marginBottom: '12px',
        }}>
            <div id="myImage" style={{display: "inline"}}>
                <img alt="" src={props.url} id="myImage"/>
            </div>
            <div id="texts" style={{display:"inline"}}> 
                <p style={{display:"inline"}}>{props.name} </p>
                <button className="btn btn-primary btn-block" style={{display:"inline"}} onClick={()=>props.callbackFn(props.id)}>Send</button>
            </div>
        </section>
        
    )
  }

const ImageContainer = (props) => {
  var rows = [];

  for (var i = 0; i < props.url.length; i++) {
      rows.push(<Image key={i} url={props.url[i]} name={props.name[i]} id={props.ids[i]} callbackFn={(id) => props.callbackFn(id)}/>);
  }
  return <div>{rows}</div>;

}
  
export default ImageContainer;