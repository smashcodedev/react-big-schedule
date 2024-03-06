import { useEffect, useReducer, useState } from 'react';
import { Scheduler, DemoData, DnDSource, SchedulerData, ViewType, wrapperFun } from 'react-big-schedule';
import ResourceItem from './components/ResourceItem';
import ResourceList from './components/ResourceList';
import TaskItem from './components/TaskItem';
import TaskList from './components/TaskList';
import { DnDTypes } from './helpers/DnDTypes';

const initialState = {
  showScheduler: false,
  viewModel: {},
};

// function reducer(state, action) {
//   switch (action.type) {
//     case 'INITIALIZE':
//       return { showScheduler: true, viewModel: action.payload };
//     case 'UPDATE_SCHEDULER':
//       return { ...state, viewModel: action.payload };
//     default:
//       return state;
//   }
// }

let schedulerData;
function DragAndDrop() {
  const [state, setState] = useState(initialState);
  const [taskDndSource, setTaskDndSource] = useState(new DnDSource(props => props.task, TaskItem, true, DnDTypes.TASK));
  const [resourceDndSource, setResourceDndSource] = useState(new DnDSource(props => props.resource, ResourceItem, true, DnDTypes.RESOURCE));
  const [isShowWeekend, setIsShowWeekend] = useState(true);

  useEffect(() => {
    schedulerData = new SchedulerData('2022-12-18', ViewType.Month, false, false, {
      schedulerMaxHeight: 500,
      // besidesWidth: window.innerWidth <= 1600 ? 400 : 500,
      besidesWidth: window.innerWidth <= 1600 ? 100 : 350,
      displayWeekend: isShowWeekend,
      // headerEnabled: false
      // dayMaxEvents: 2,
      // weekMaxEvents: 4,
      // monthMaxEvents: 4,
      // quarterMaxEvents: 4,
      // yearMaxEvents: 4,
      // views: [
      //   { viewName: 'Agenda View', viewType: ViewType.Month, showAgenda: true, isEventPerspective: false },
      //   { viewName: 'Resource View', viewType: ViewType.Month, showAgenda: false, isEventPerspective: false },
      //   { viewName: 'Task View', viewType: ViewType.Month, showAgenda: false, isEventPerspective: true },
      // ],
    });
    schedulerData.localeDayjs.locale('en');
    // schedulerData.setResources(DemoData.resources);
    console.log(DemoData)
    schedulerData.setResources([
      { id: 'r0', name: 'Resource0', title: 'Resource 0', groupOnly: false },
      { id: 'r1', name: 'Resource1', title: 'Resource 1', parentId: 'r0' },
      { id: 'r2', name: 'Resource2', parentId: 'r3' },
      { id: 'r3', name: 'Resource3', parentId: 'r1' },
      { id: 'r4', name: 'Resource4' },
      { id: 'r5', name: 'Resource5' },
      { id: 'r6', name: 'Resource6' },
      { id: 'r7', name: 'Resource7' }
    ]);
    // schedulerData.setEvents(DemoData.eventsForTaskView);
    schedulerData.setEvents([
      // {id: 1, start: '2022-12-18 09:30:00', end: '2022-12-18 23:30:00', resourceId: 'r1', title: 'I am finished', …}
    ]);

    setState({
      showScheduler: true,
      viewModel: schedulerData
    })
    // dispatch({ type: 'INITIALIZE', payload: schedulerData });
    setTaskDndSource(new DnDSource(props => props.task, TaskItem, true, DnDTypes.TASK));
    setResourceDndSource(new DnDSource(props => props.resource, ResourceItem, true, DnDTypes.RESOURCE));

    return () => {
      schedulerData = null;
    };
  }, [isShowWeekend]);

  const prevClick = schedulerData => {
    schedulerData.prev();
    schedulerData.setEvents(DemoData.eventsForTaskView);
    setState({ ...state, viewModel: schedulerData });
  };

  const nextClick = schedulerData => {
    schedulerData.next();
    schedulerData.setEvents(DemoData.eventsForTaskView);
    setState({ ...state, viewModel: schedulerData });
  };

  const onViewChange = (schedulerData, view) => {
    schedulerData.setViewType(view.viewType, view.showAgenda, view.isEventPerspective);
    schedulerData.config.creatable = !view.isEventPerspective;
    schedulerData.setEvents(DemoData.eventsForTaskView);
    setState({ ...state, viewModel: schedulerData });
  };

  const onSelectDate = (schedulerData, date) => {
    schedulerData.setDate(date);
    schedulerData.setEvents(DemoData.eventsForTaskView);
    setState({ ...state, viewModel: schedulerData });
  };

  const eventClicked = (schedulerData, event) => {
    alert(`You just clicked an event: {id: ${event.id}, title: ${event.title}}`);
  };

  const ops1 = (schedulerData, event) => {
    alert(`You just executed ops1 to event: {id: ${event.id}, title: ${event.title}}`);
  };

  const ops2 = (schedulerData, event) => {
    alert(`You just executed ops2 to event: {id: ${event.id}, title: ${event.title}}`);
  };

  const newEvent = (schedulerData, slotId, slotName, start, end, type, item) => {
    if (confirm(`Do you want to create a new event? {slotId: ${slotId}, slotName: ${slotName}, start: ${start}, end: ${end}, type: ${type}, item: ${item}}`)) {
      let newFreshId = 0;
      schedulerData.events.forEach(item => {
        if (item.id >= newFreshId) newFreshId = item.id + 1;
      });

      let newEvent = {
        id: newFreshId,
        title: 'New event you just created',
        start: start,
        end: end,
        resourceId: slotId,
        bgColor: 'purple',
      };

      if (type === DnDTypes.RESOURCE) {
        newEvent = {
          ...newEvent,
          groupId: slotId,
          groupName: slotName,
          resourceId: item.id,
        };
      } else if (type === DnDTypes.TASK) {
        newEvent = {
          ...newEvent,
          groupId: item.id,
          groupName: item.name,
        };
      }

      schedulerData.addEvent(newEvent);
      setState({ ...state, viewModel: schedulerData });
    }
  };

  const updateEventStart = (schedulerData, event, newStart) => {
    if (confirm(`Do you want to adjust the start of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newStart: ${newStart}}`)) {
      schedulerData.updateEventStart(event, newStart);
    }
    setState({ ...state, viewModel: schedulerData });
  };

  const updateEventEnd = (schedulerData, event, newEnd) => {
    if (confirm(`Do you want to adjust the end of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newEnd: ${newEnd}}`)) {
      schedulerData.updateEventEnd(event, newEnd);
    }
    setState({ ...state, viewModel: schedulerData });
  };

  const moveEvent = (schedulerData, event, slotId, slotName, start, end) => {
    if (
      confirm(
        `Do you want to move the event? {eventId: ${event.id}, eventTitle: ${event.title}, newSlotId: ${slotId}, newSlotName: ${slotName}, newStart: ${start}, newEnd: ${end}`
      )
    ) {
      schedulerData.moveEvent(event, slotId, slotName, start, end);
      setState({ ...state, viewModel: schedulerData });
    }
  };

  const movingEvent = (schedulerData, slotId, slotName, newStart, newEnd, action, type, item) => {
    console.log('moving event', schedulerData, slotId, slotName, newStart, newEnd, action, type, item);
  };

  const subtitleGetter = (schedulerData, event) => {
    return schedulerData.isEventPerspective ? schedulerData.getResourceById(event.resourceId).name : event.groupName;
  };

  const toggleExpandFunc = (schedulerData, slotId) => {
    schedulerData.toggleExpandStatus(slotId);
    setState({ ...state, viewModel: schedulerData });
  };

  const handleToggleWeekends = () => {
    setIsShowWeekend((prev) => !prev);
    // let prevVal = state?.viewModel?.config?.displayWeekend;
    // // console.log(schedulerData.displayWeekend)
    // setState({
    //   ...state,
    //   viewModel: {
    //     ...state.viewModel,
    //     config: {
    //       ...state.viewModel?.config,
    //       displayWeekend: !prevVal
    //     }
    //   }
    // })
    // schedulerData.config.displayWeekend = !schedulerData.config.displayWeekend
  }

  // console.log(state.viewModel?.config?.displayWeekend)

  //   let leftCustomHeader = (
  //     <div>
  //         <span style={{ fontWeight: 'bold' }}><a onClick={this.showModal}>Add a resource</a></span>
  //         <AddResourceForm
  //             ref={this.saveFormRef}
  //             visible={this.state.visible}
  //             onCancel={this.handleCancel}
  //             onCreate={this.handleCreate}
  //             addResource={this.addResource}
  //         />
  //     </div>
  // );
  return (
    <>
      {state.showScheduler && (
        <>
          {/* <button onClick={handleToggleWeekends}>{isShowWeekend ? "Hide" : "Show"} weekends</button> */}
          {/* <div>
            <p>
              {state.showScheduler &&
                (state.viewModel?.isEventPerspective ? 'Drag a resource from outside and drop to the resource view.' : 'Drag a task from outside and drop to the resource view')}
            </p>
          </div> */}
          <div>
            <div span={20}>
              <Scheduler
                schedulerData={state.viewModel}
                prevClick={prevClick}
                nextClick={nextClick}
                onSelectDate={onSelectDate}
                onViewChange={onViewChange}
                eventItemClick={eventClicked}
                viewEventClick={ops1}
                viewEventText='Ops 1'
                viewEvent2Text='Ops 2'
                viewEvent2Click={ops2}
                updateEventStart={updateEventStart}
                updateEventEnd={updateEventEnd}
                moveEvent={moveEvent}
                movingEvent={movingEvent}
                newEvent={newEvent}
                subtitleGetter={subtitleGetter}
                dndSources={[taskDndSource, resourceDndSource]}
                toggleExpandFunc={toggleExpandFunc}
              // custom event 
              // eventItemTemplateResolver
              // left custom header
              // leftCustomHeader={leftCustomHeader}
              // right custom header
              // rightCustomHeader={rightCustomHeader}
              // custom header
              // nonAgendaCellHeaderTemplateResolver={nonAgendaCellHeaderTemplateResolver}
              />
            </div>
            {/* <div span={4}>
              {state.viewModel.isEventPerspective ? (
                <ResourceList schedulerData={state.viewModel} newEvent={newEvent} resourceDndSource={resourceDndSource} />
              ) : (
                <TaskList schedulerData={state.viewModel} newEvent={newEvent} taskDndSource={taskDndSource} />
              )}
            </div> */}
          </div>
        </>
      )}
    </>
  );
}

// eventItemTemplateResolver = (schedulerData, event, bgColor, isStart, isEnd, mustAddCssClass, mustBeHeight, agendaMaxEventWidth) => {
//   let borderWidth = isStart ? '4' : '0';
//   let borderColor =  'rgba(0,139,236,1)', backgroundColor = '#80C5F6';
//   let titleText = schedulerData.behaviors.getEventTextFunc(schedulerData, event);
//   if(!!event.type){
//       borderColor = event.type == 1 ? 'rgba(0,139,236,1)' : (event.type == 3 ? 'rgba(245,60,43,1)' : '#999');
//       backgroundColor = event.type == 1 ? '#80C5F6' : (event.type == 3 ? '#FA9E95' : '#D9D9D9');
//   }
//   let divStyle = {borderLeft: borderWidth + 'px solid ' + borderColor, backgroundColor: backgroundColor, height: mustBeHeight };
//   if(!!agendaMaxEventWidth)
//       divStyle = {...divStyle, maxWidth: agendaMaxEventWidth};

//   return <div key={event.id} className={mustAddCssClass} style={divStyle}>
//       <span style={{marginLeft: '4px', lineHeight: `${mustBeHeight}px` }}>{titleText}</span>
//   </div>;
// }



// nonAgendaCellHeaderTemplateResolver = (schedulerData, item, formattedDateItems, style) => {
//   let datetime = schedulerData.localeMoment(item.time);
//   let isCurrentDate = false;

//   if (schedulerData.viewType === ViewTypes.Day) {
//       isCurrentDate = datetime.isSame(new Date(), 'hour');
//   }
//   else {
//       isCurrentDate = datetime.isSame(new Date(), 'day');
//   }

//   if (isCurrentDate) {
//       style.backgroundColor = '#118dea';
//       style.color = 'white';
//   }

//   return (
//       <th key={item.time} className={`header3-text`} style={style}>
//           {
//               formattedDateItems.map((formattedItem, index) => (
//                   <div key={index}
//                        dangerouslySetInnerHTML={{__html: formattedItem.replace(/[0-9]/g, '<b>$&</b>')}}/>
//               ))
//           }
//       </th>
//   );
// }


export default wrapperFun(DragAndDrop);