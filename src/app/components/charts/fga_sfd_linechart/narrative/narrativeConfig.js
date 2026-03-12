const NARRATIVE_STAGES = {
  INITIAL: "initial",
  MESSAGE_ONE: "message-one",
  SHADED_ERA: "shaded-era",
  MESSAGE_TWO: "message-two",
  RESET: "reset",
};

function getNarrativeStage(progress) {
  if (progress < 0.2) return NARRATIVE_STAGES.INITIAL;
  if (progress < 0.4) return NARRATIVE_STAGES.MESSAGE_ONE;
  if (progress < 0.6) return NARRATIVE_STAGES.SHADED_ERA;
  if (progress < 0.8) return NARRATIVE_STAGES.MESSAGE_TWO;
  return NARRATIVE_STAGES.RESET;
}

function getNarrativeMessage(stage) {
  if (stage === NARRATIVE_STAGES.MESSAGE_ONE) {
    return {
      title: "Do you see the trend?",
      body: "Let me mark the 3-point era for you. How does the FGA and SFD Rate change for 2-pointers and 3-pointers?",
    };
  }

  if (stage === NARRATIVE_STAGES.MESSAGE_TWO) {
    return {
      title: "Trend",
      body: `After the 2014-2015 season, players are shooting more 3-pointers and less 2-pointers.
      Also, it's easier for them to draw fouls for both 2-pointers and 3-pointers.`,
    };
  }

  return null;
}

export { NARRATIVE_STAGES, getNarrativeStage, getNarrativeMessage };
