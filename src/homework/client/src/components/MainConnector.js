import { connect } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { getItemsAction,addItemsAction,clearAllItemsAction } from "../actions/items-entities-actions";
import { getList } from "../selectors/items-entities-selectors";

import Main from "./Main";

const mapStateToProps = (state, ownProps) => {
    const list = getList(state)
  return {list};
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators(
    {
        getItemsAction,addItemsAction,clearAllItemsAction
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);