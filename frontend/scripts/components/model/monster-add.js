// IMPORTS =========================================================================================
import {map} from "ramda";
import Class from "classnames";
import {branch} from "baobab-react/decorators";
import React from "react";
import DocumentTitle from "react-document-title";
import {formatQuery} from "shared/helpers/jsonapi";
import monsterValidators from "shared/validators/monster";
import monsterActions from "frontend/actions/monster";
import {ShallowComponent, DeepComponent, Link} from "frontend/components/simple";
import {Error, Loading, NotFound} from "frontend/components/page";
import {Form} from "frontend/components/form";

// COMPONENTS ======================================================================================
@branch({
  cursors: {
    robots: "monsters",
  },
})
export default class MonsterAdd extends Form {
  static loadData = monsterActions.loadIndex;

  constructor(props) {
    super();
    this.state = {
      model: {
        name: undefined,
        birthDate: undefined,
        citizenship: undefined,
      },
    };
  }

  render() {
    return <div>MonsterAdd</div>;
  }
}

  //render() {
  //  return <div>Add</div>;
    //let {models, loading, loadError} = this.state.cursors.monsters;
    //return (
    //  <Form models={models} loading={loading} loadError={loadError}/>
    //);
  //}
//}

//class Form extends DeepComponent {
//  getInitialState() {
//    return {
//      model: {
//        name: undefined,
//        assemblyDate: undefined,
//        manufacturer: undefined,
//      },
//    }
//  },
//
//  handleSubmit(event) {
//    event.preventDefault();
//    event.persist();
//    this.validate().then(isValid => {
//      if (isValid) {
//        monsterActions.add({
//          name: React.findDOMNode(this.refs.name).value,
//          assemblyDate: React.findDOMNode(this.refs.assemblyDate).value,
//          manufacturer: React.findDOMNode(this.refs.manufacturer).value,
//        });
//      } else {
//        alert("Can't submit form with errors");
//      }
//    });
//  },
//
//  render() {
//    let {models, loading, loadError} = this.props;
//    let model = this.state.model;
//
//    if (loading) {
//      return <Loading/>;
//    } else if (loadError) {
//      return <Error loadError={loadError}/>;
//    } else {
//      return (
//        <DocumentTitle title={"Add Monster"}>
//          <div>
//            <MonsterAddActions {...this.props}/>
//            <section className="container margin-top-lg">
//              <div className="row">
//                <div className="col-xs-12 col-sm-9">
//                  <h1 className="nomargin-top">Add Monster</h1>
//                  <form onSubmit={this.handleSubmit}>
//                    <fieldset>
//                      <div className={Class("form-group", {
//                        "required": (this.validatorTypes().name._flags.presence == "required"),
//                        "error": this.hasErrors("name"),
//                      })}>
//                        <label htmlFor="name">Name</label>
//                        <input type="text" onBlur={() => this.validate("name")} onChange={this.handleChangeFor("name")} className="form-control" id="name" ref="name" value={model.name}/>
//                        <div className={Class("help", {
//                          "error": this.hasErrors("name"),
//                        })}>
//                          {map(message => <span key="">{message}</span>, this.getErrors("name")}
//                        </div>
//                      </div>
//
//                      <div className={Class("form-group", {
//                        "required": (this.validatorTypes().assemblyDate._flags.presence == "required"),
//                        "error": this.hasErrors("assemblyDate")
//                      })}>
//                        <label htmlFor="assemblyDate">Assembly Date</label>
//                        <input type="text" onBlur={() => this.validate("assemblyDate")} onChange={this.handleChangeFor("assemblyDate")} className="form-control" id="assemblyDate" ref="assemblyDate" value={model.assemblyDate}/>
//                        <div className={Class("help", {
//                          "error": this.hasErrors("assemblyDate"),
//                        })}>
//                          {map(message => <span key="">{message}</span>, this.getErrors("assemblyDate")}
//                        </div>
//                      </div>
//
//                      <div className={Class("form-group", {
//                        "required": (this.validatorTypes().manufacturer._flags.presence == "required"),
//                        "error": this.hasErrors("manufacturer")
//                      })}>
//                        <label htmlFor="manufacturer">Manufacturer</label>
//                        <input type="text" onBlur={() => this.validate("manufacturer")} onChange={this.handleChangeFor("manufacturer")} className="form-control" id="manufacturer" ref="manufacturer" value={model.manufacturer}/>
//                        <div className={Class("help", {
//                          "error": this.hasErrors("manufacturer"),
//                        })}>
//                          {map(message => <span key="">{message}</span>, this.getErrors("manufacturer")}
//                        </div>
//                      </div>
//                    </fieldset>
//                    <div className="btn-group">
//                      <button className="btn btn-default" type="button" onClick={event => this.handleReset(event)}>Reset</button>
//                      <button className="btn btn-primary" type="button" disabled={this.hasErrors}>Submit</button>
//                    </div>
//                  </form>
//                </div>
//              </div>
//            </section>
//          </div>
//        </DocumentTitle>
//      );
//    }
//  }
//}

class MonsterAddActions extends ShallowComponent {
  render() {
    return (
      <div id="page-actions">
        <div className="container">
          <div className="btn-group btn-group-sm pull-left">
            <Link to="monster-index" className="btn btn-gray-light" title="Back to list">
              <span className="fa fa-arrow-left"></span>
              <span className="hidden-xs margin-left-sm">Back to list</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

/*
<TextInput label="Name" placeholder="Name" id="model.name" form={this}/>
<TextInput label="Assembly Date" placeholder="Assembly Date" id="model.assemblyDate" form={this}/>
<TextInput label="Manufacturer" placeholder="Manufacturer" id="model.manufacturer" form={this}/>
*/
