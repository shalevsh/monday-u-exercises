import List from "./List";
import { connect } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import {getList} from "../selectors/items-entities-selectors";
const mapStateToProps = (state, ownPrpos)=>{
    const list = getList(state);
    return {
        ...ownPrpos,list
    }
}

const mapDispatchToProps = (dispatch, ownProps) =>{
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(List);