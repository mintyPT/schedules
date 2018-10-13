import React from "react";
import moment from "moment";
import ReactDOM from "react-dom";
import styled from "styled-components";
import _ from "lodash";

import "./styles.css";

const employees = [
  {
    id: 1,
    active: true,
    name: "Mauro",
    schedules: [
      { id: 1, day: "MONDAY", from: 8 * 60, to: 12 * 60, type: "working" },
      { id: 2, day: "MONDAY", from: 13 * 60, to: 18 * 60, type: "working" }
    ]
  },
  {
    id: 2,
    active: true,
    name: "Su",
    schedules: [
      { id: 3, day: "MONDAY", from: 12 * 60, to: 24 * 60, type: "working" }
    ]
  },
  {
    id: 3,
    name: "Igor",
    active: false,
    schedules: [
      { id: 4, day: "MONDAY", from: 0 * 60, to: 4.5 * 60, type: "working" },
      { id: 5, day: "TUESDAY", from: 5.5 * 60, to: 9 * 60, type: "working" }
    ]
  }
];

const Day = styled.li`
  display: inline-block;
  margin-right: 10px;
  color: ${props => (props.selected ? "red" : "black")};
`;

const Days = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const Handle = styled.div`
  position: absolute;
  ${props => props.kind}: 0;
  top: 0;
  bottom: 0;
  background: red;
  width: 5px;
  &:hover{
    background: yellow;
  }
`;

function ViewSelector(props) {
  return (
    <Days>
      <Day
        selected={props.selected === "DAY"}
        onClick={() => props.setSelected("DAY")}
      >
        Dia
      </Day>
      <Day
        selected={props.selected === "WEEK"}
        onClick={() => props.setSelected("WEEK")}
      >
        Semana
      </Day>
      <Day
        selected={props.selected === "MONTH"}
        onClick={() => props.setSelected("MONTH")}
      >
        Mês
      </Day>
      <Day
        selected={props.selected === "YEAR"}
        onClick={() => props.setSelected("YEAR")}
      >
        Ano
      </Day>
    </Days>
  );
}

function DaySelector(props) {
  return (
    <Days>
      <Day
        selected={props.selected === "MONDAY"}
        onClick={() => props.setSelected("MONDAY")}
      >
        Segunda
      </Day>
      <Day
        selected={props.selected === "TUESDAY"}
        onClick={() => props.setSelected("TUESDAY")}
      >
        Terça
      </Day>
      <Day
        selected={props.selected === "WEDNESDAY"}
        onClick={() => props.setSelected("WEDNESDAY")}
      >
        Quarta
      </Day>
      <Day
        selected={props.selected === "THURSDAY"}
        onClick={() => props.setSelected("THURSDAY")}
      >
        Quinta
      </Day>
      <Day
        selected={props.selected === "FRIDAY"}
        onClick={() => props.setSelected("FRIDAY")}
      >
        Sexta
      </Day>
      <Day
        selected={props.selected === "SATURDAY"}
        onClick={() => props.setSelected("SATURDAY")}
      >
        Sábado
      </Day>
      <Day
        selected={props.selected === "SUNDAY"}
        onClick={() => props.setSelected("SUNDAY")}
      >
        Domingo
      </Day>
    </Days>
  );
}

class EmployeeSegmentHandle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { active: false };
  }

  componentDidMount() {
    // document.addEventListener("mousedown", this.mousedown);
    document.addEventListener("mouseup", this.mouseup);
    document.addEventListener("mousemove", this.mousemove);
  }

  componentWillUnmount() {
    //document.removeEventListener("mousedown", this.mousedown);
    document.removeEventListener("mouseup", this.mouseup);
    document.removeEventListener("mousemove", this.mousemove);
  }

  onMouseDown = event => {
    this.setState({ active: true });
  };

  mousedown = event => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ active: true });
    }
  };

  mouseup = event => {
    this.setState({ active: false });
  };
  mousemove = event => {
    if (this.state.active && this.props.onMouseMove) {
      this.props.onMouseMove(event);
    }
  };

  /**
   * Set the wrapper ref
   */
  setWrapperRef = node => {
    this.wrapperRef = node;
  };

  render() {
    const { props } = this;
    return (
      <div ref={this.setWrapperRef} onMouseDown={this.onMouseDown}>
        <Handle kind={props.kind} />
      </div>
    );
  }
}

class Employee extends React.Component {
  constructor(props) {
    super(props);

    this.handle = {};
  }

  move = (e, empId, segId, kind) => {
    var container = ReactDOM.findDOMNode(
      this.containerRef
    ).getBoundingClientRect();

    const handle2 = (kind === "from" ? "l" : "r") + "." + segId;
    var rect2 = ReactDOM.findDOMNode(
      this.handle[handle2]
    ).getBoundingClientRect();

    const { left: handleLeft } = rect2;

    const left = e.pageX;

    const pl = (left - container.left) / container.width;

    const value = 24 * 60 * pl;
    const rounded = value - (value % 5);

    this.props.setSchedule(empId, segId, kind, rounded);
  };

  render() {
    return (
      <div
        style={{
          background: "#eee",
          position: "relative",
          marginBottom: "20px",
          height: "40px"
        }}
        ref={element => {
          this.containerRef = element;
        }}
      >
        <span style={{ position: "absolute", left: 0, zIndex: 1 }}>
          {this.props.s.name}
        </span>

        {this.props.s.schedules.map((ss, j) => {
          if (ss.day !== this.props.selected) {
            return;
          }

          const to = moment.duration(ss.to / 60, "hours");
          const frmo = moment.duration(ss.from / 60, "hours");
          const fd = moment.duration((ss.to - ss.from) / 60, "hours");

          let fto = moment.utc(to.asMilliseconds()).format("H:mm");
          let ffrmo = moment.utc(frmo.asMilliseconds()).format("H:mm");
          let ffd = moment.utc(fd.asMilliseconds()).format("H:mm");

          return (
            <div
              style={{
                borderRadius: "4px",
                overflow: "hidden",
                top: 0,
                background: "rgba(0,0,0,0.1)",
                position: "absolute",
                height: "100%",
                left: (100 * ss.from) / (24 * 60) + "%",
                width: (100 * (ss.to - ss.from)) / (24 * 60) + "%",
                textAlign: "center",
                userSelect: "none"
              }}
            >
              {ffrmo}-{fto}
              <EmployeeSegmentHandle
                kind="left"
                onMouseMove={e => this.move(e, this.props.s.id, ss.id, "from")}
                ref={element => {
                  this.handle["l." + ss.id] = element;
                }}
              />
              <EmployeeSegmentHandle
                kind="right"
                onMouseMove={e => this.move(e, this.props.s.id, ss.id, "to")}
                ref={element => {
                  this.handle["r." + ss.id] = element;
                }}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

function App(props) {
  return (
    <div className="App">
      <ViewSelector selected={props.selected} setSelected={props.setSelected} />
      <DaySelector selected={props.day.selected} setSelected={props.setDay} />

      <div style={{}}>
        {props.employees.map(s => {
          return (
            <Employee
              selected={props.day.selected}
              onDragOver={props.onDragOver}
              onDragStart={props.onDragStart}
              setSchedule={props.setSchedule}
              s={s}
            />
          );
        })}
      </div>
    </div>
  );
}

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: "DAY",
      day: { selected: "MONDAY" },
      employees,
      dragging: null
    };
  }
  render() {
    return (
      <App
        setSelected={selected => this.setState({ selected })}
        setDay={selected => {
          const state = { ...this.state };
          state.day.selected = selected;
          this.setState(state);
        }}
        toggleUser={uId => {
          const state = this.state;
          const employees = _.get(state, "employees", []);
          const uPos = _.findIndex(employees, e => e.id === uId);
          if (uPos > -1) {
            const k = "employees." + uPos + ".acive";
            _.set(state, k);
          }
        }}
        setSchedule={(uId, sId, kind, value) => {
          const state = this.state;
          const employees = _.get(state, "employees", []);
          const uPos = _.findIndex(employees, e => e.id === uId);
          if (uPos > -1) {
            const schedules = _.get(employees, uPos + ".schedules");
            const sPos = _.findIndex(schedules, s => s.id === sId);
            if (sPos > -1) {
              const s = "employees." + uPos + ".schedules." + sPos + "." + kind;
              const old = _.get(state, s);
              _.set(state, s, value);
              this.setState(state);
            }
          }
        }}
        {...this.state}
      />
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Root />, rootElement);
