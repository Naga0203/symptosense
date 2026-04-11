from openai import OpenAI
from typing import List, Dict, Any, Optional, Callable
import os
import json


class Agent:
    def __init__(
        self,
        name: str,
        role: str,
        goal: str,
        backstory: str,
        tools: Optional[List[Callable]] = None
    ):
        self.name = name
        self.role = role
        self.goal = goal
        self.backstory = backstory
        self.tools = tools or []
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY', ''))

    def execute(self, task: str, context: Optional[Dict[str, Any]] = None) -> str:
        system_prompt = self._build_system_prompt(context)
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": task}
        ]
        
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=messages,
            temperature=0.7,
            max_tokens=1000
        )
        
        return response.choices[0].message.content

    def _build_system_prompt(self, context: Optional[Dict[str, Any]] = None) -> str:
        prompt = f"You are {self.name}, a {self.role}.\n\n"
        prompt += f"Goal: {self.goal}\n\n"
        prompt += f"Backstory: {self.backstory}\n\n"
        
        if context:
            prompt += f"\nContext:\n{json.dumps(context, indent=2)}\n\n"
        
        if self.tools:
            prompt += "\nAvailable tools:\n"
            for tool in self.tools:
                prompt += f"- {tool.__name__}\n"
        
        return prompt


class AIAgentsService:
    def __init__(self):
        self.agents: Dict[str, Agent] = {}
        self.workflows: Dict[str, List[str]] = {}

    def create_agent(
        self,
        name: str,
        role: str,
        goal: str,
        backstory: str,
        tools: Optional[List[Callable]] = None
    ) -> Agent:
        agent = Agent(name, role, goal, backstory, tools)
        self.agents[name] = agent
        return agent

    def get_agent(self, name: str) -> Optional[Agent]:
        return self.agents.get(name)

    def create_workflow(self, workflow_name: str, agent_names: List[str]):
        self.workflows[workflow_name] = agent_names

    def execute_workflow(
        self,
        workflow_name: str,
        initial_task: str,
        context: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        if workflow_name not in self.workflows:
            raise ValueError(f"Workflow '{workflow_name}' not found")
        
        results = []
        current_context = context or {}
        current_task = initial_task
        
        for agent_name in self.workflows[workflow_name]:
            agent = self.agents.get(agent_name)
            if agent is None:
                results.append({
                    'agent': agent_name,
                    'status': 'error',
                    'error': f"Agent '{agent_name}' not found"
                })
                continue
            
            try:
                result = agent.execute(current_task, current_context)
                results.append({
                    'agent': agent_name,
                    'status': 'success',
                    'result': result
                })
                current_context[agent_name] = result
                current_task = result
            except Exception as e:
                results.append({
                    'agent': agent_name,
                    'status': 'error',
                    'error': str(e)
                })
                break
        
        return results

    def list_agents(self) -> List[str]:
        return list(self.agents.keys())

    def list_workflows(self) -> List[str]:
        return list(self.workflows.keys())


ai_service = AIAgentsService()
