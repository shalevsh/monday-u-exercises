import { connect } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import {deleteItemAction,updateCheckBoxAction} from "../actions/items-entities-actions";
import ListItem from "./ListItem";
const mapStateToProps = (state, ownPrpos)=>{
    return {
        
    }
}

const mapDispatchToProps = (dispatch, ownProps) =>{
    return bindActionCreators({deleteItemAction,updateCheckBoxAction}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ListItem);