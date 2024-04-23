<template>
    <div ref="visContainer" class="vis-container"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Network } from 'vis-network/standalone';

// 使用 UUID 作为节点 ID 的示例数据
const nodes = [

    {
        "id": "1f437e59-97e9-4d33-803b-08e00d5e89a6",
        "label": "集合的概念",
        "title": "把一些元素组成的总体叫做集合。集合三要素：确定性、互异性、无序性。"
    },
    {
        "id": "aa78fcf2-7778-4059-b812-ad4336763563",
        "label": "集合的表示方法",
        "title": "集合的表示方法主要有两种：列举法和描述法。列举法是把集合的所有元素一一列举出来，并用花括号括起来表示集合的方法。描述法是指出集合中元素具有的共同特征来描述集合。"
    },
    {
        "id": "4f5ada7f-b5a1-4e7d-8ae8-e00e074a3cf0",
        "label": "集合的相等",
        "title": "只要构成两个集合的元素是一样的，就称这两个集合相等。"
    },
    {
        "id": "e1f2d858-2446-46e2-b230-f96a097bfdcd",
        "label": "元素和集合的关系",
        "title": "元素与集合之间的基本关系包括属于（∈）和不属于（∉）。"
    },
    {
        "id": "e3b3124e-79cd-4132-aa27-b32cc4afae17",
        "label": "集合的子集",
        "title": "对于两个集合A和B，如果集合A中的任意一个元素都是集合B中的元素，则称集合A是集合B的子集，记作A⊆B。"
    },
    {
        "id": "99b9e7d4-4219-41a1-9423-4842226cf7ab",
        "label": "集合的并集",
        "title": "由所有属于集合A或集合B的元素组成的集合，称为集合A与集合B的并集，记作A∪B。"
    },
    {
        "id": "254ee9e6-f248-4d6d-bddd-e9cca2cf54c8",
        "label": "集合的交集",
        "title": "由所有同时属于集合A和集合B的元素组成的集合，称为集合A与集合B的交集，记作A∩B。"
    },
    {
        "id": "288fe341-029e-4d73-bcf7-c6ec2e739547",
        "label": "集合的补集",
        "title": "在全集U中，所有不属于集合A的元素组成的集合，称为集合A的补集，记作A'或C(U,A)。"
    },
    {
        "id": "47030ac0-e5b4-4ab8-9bce-5063fd6f241e",
        "label": "集合的基数",
        "title": "集合中元素的个数称为集合的基数。"
    },
    {
        "id": "47779335-14d0-43be-83f2-1879b75807cf",
        "label": "幂集",
        "title": "对于任意集合A，由A的所有子集组成的集合称为A的幂集，记作P(A)。"
    },
    {
        "id": "4052a456-0903-400a-bc21-735ceff7055e",
        "label": "集合的运算",
        "title": "集合的运算包括并集、交集、差集、补集等，是处理集合问题的基本方法。"
    },
    {
        "id": "ab0650c1-32b7-4740-954a-4af60c1efda3",
        "label": "集合的列举法",
        "title": "列举法是指把集合中的所有元素明确地一一列出来的方法，通常用花括号{}括起来，例如集合A={1,2,3}表示包含1,2,3这三个元素的集合。"
    },
    {
        "id": "123d7241-b04f-4538-83f0-1f8c81a2d294",
        "label": "集合的描述法",
        "title": "描述法是通过描述集合中元素的共同特征来确定集合，例如集合B={x|x是大于0的整数}表示包含所有大于0的整数的集合。"
    },
    {
        "id": "14f7e95e-fddd-49e0-9c5d-871f1431b945",
        "label": "元素属于集合",
        "title": "元素a属于集合A，记作a∈A。"
    },
    {
        "id": "397fb562-be8c-4051-98bc-bd6b63c41f10",
        "label": "元素不属于集合",
        "title": "元素a不属于集合A，记作a∉A。"
    },
    {
        "id": "98238051-c198-4752-ba4a-123ad5ffd26b",
        "label": "集合的交集的性质",
        "title": "集合的交集满足交换律(A∩B=B∩A)和结合律(A∩(B∩C)=(A∩B)∩C)。"
    },
    {
        "id": "39a8b116-93e4-49cb-98f7-0b82851dc6d1",
        "label": "集合的并集的性质",
        "title": "集合的并集满足交换律(A∪B=B∪A)和结合律(A∪(B∪C)=(A∪B)∪C)。"
    },
    {
        "id": "462d9722-96b4-4ca4-ad7b-8b6d2a56a502",
        "label": "集合的交换律",
        "title": "集合的并集和交集运算遵循交换律，即A∪B=B∪A，A∩B=B∩A。"
    },
    {
        "id": "e751a6c5-3930-4a36-9018-ac9e41f7767d",
        "label": "集合的结合律",
        "title": "集合的并集和交集运算遵循结合律，即(A∪B)∪C=A∪(B∪C)，(A∩B)∩C=A∩(B∩C)。"
    },
    {
        "id": "afbbc2f6-9188-4bbb-9a22-97cacdecd0b2",
        "label": "集合的分配律",
        "title": "集合的并集和交集运算遵循分配律，即A∪(B∩C)=(A∪B)∩(A∪C)，A∩(B∪C)=(A∩B)∪(A∩C)。"
    },
    {
        "id": "0b671c9a-e7e6-4bce-a692-ba171e573dfd",
        "label": "有限集与无限集",
        "title": "有限集是指包含有限个元素的集合；无限集是指包含无限个元素的集合。"
    },
    {
        "id": "c1333168-9052-4f18-9e65-8c4f84e383e5",
        "label": "空集的基数",
        "title": "空集是没有任何元素的集合，其基数为0。"
    },
    {
        "id": "c1820377-b7fc-46f4-9c7e-083ab74c4e9d",
        "label": "集合元素的计数原理",
        "title": "计算一个集合的基数，即计算集合中元素的个数。"
    },
    {
        "id": "7900ae58-9af8-4bea-8532-63b72e958aac",
        "label": "空集",
        "title": "空集是不包含任何元素的集合。"
    },
    {
        "id": "91116d2f-a96d-48a2-841b-19a6b9389687",
        "label": "有限集",
        "title": "有限集是指元素个数有限的集合。"
    },
    {
        "id": "ef1791c9-e1ca-4dcf-9dcf-4517ffc4edd3",
        "label": "无限集",
        "title": "无限集是指元素个数无限的集合。"
    },
    {
        "id": "9a4f0ac9-251a-46b4-950a-4eca3e33ddbe",
        "label": "自然数集N",
        "title": "自然数集N，包括所有非负整数。"
    },
    {
        "id": "30c2b28e-9be6-45f2-8db7-c23488e91c8e",
        "label": "正整数集N+",
        "title": "正整数集N+，包括所有正整数。"
    },
    {
        "id": "1d6e55f7-a6f7-42fd-9343-a715b3ccef88",
        "label": "整数集Z",
        "title": "整数集Z，包括所有整数，即正整数、负整数和零。"
    },
    {
        "id": "8072f530-4792-4607-9021-3f2c7c587533",
        "label": "有理数集Q",
        "title": "有理数集Q，包括所有可以表示为两个整数比的数。"
    },
    {
        "id": "f8851def-2d7d-4742-abac-e9d1d716667b",
        "label": "实数集R",
        "title": "实数集R，包括所有可以用数轴上的点表示的数，既包括有理数也包括无理数。"
    },
    {
        "id": "e3914a62-8389-4571-a8b0-4f91e55cd446",
        "label": "常见数集",
        "title": "常见数集包括自然数集、正整数集、整数集、有理数集和实数集。"
    },
    {
        "id": "a75d416f-21a3-470e-bc2a-468508d6253c",
        "label": "充分条件和必要条件",
        "title": "如果A是B的充分条件，则A发生时B必然发生；如果A是B的必要条件，则B发生时A必须已经发生。"
    },
    {
        "id": "f06015fb-48a9-4b12-b9e0-b6789f4911ba",
        "label": "逻辑用语",
        "title": "逻辑用语包括与或非等基本逻辑关系，是理解数学证明和逻辑推理的基础。"
    },
    {
        "id": "732af70f-dd9d-4ff5-b474-4ce884319a6b",
        "label": "充分条件",
        "title": "如果命题“若P，则Q”为真，那么我们说P是Q的充分条件。"
    },
    {
        "id": "1d78d43a-224d-4c92-b932-e37d6c0af35d",
        "label": "必要条件",
        "title": "如果命题“若P，则Q”为真，那么我们说P是Q的必要条件。"
    },
    {
        "id": "5892c412-bf0c-4e7f-964d-4362a08e92f6",
        "label": "全称量词",
        "title": "短语“所有的”“任意一个”在逻辑中通常叫做全称量词，并用符号“∀”表示。含有全称量词的命题，叫做全称量词命题。"
    },
    {
        "id": "0ec5b096-c505-4620-b461-02b75795db2b",
        "label": "存在量词",
        "title": "短语“存在一个”“至少有一个”在逻辑中通常叫做存在量词，并用符号“∃”表示。含有存在量词的命题，叫做存在量词命题。"
    },
    {
        "id": "c2d48979-549b-4ad8-8825-0ad8746156a0",
        "label": "全称量词命题",
        "title": "形如∀x∈M, p(x)的命题，表示对于集合M中的所有元素x，命题p(x)都成立。"
    },
    {
        "id": "176f4ded-d4ca-409e-b30c-b2891a5ac93d",
        "label": "存在量词命题",
        "title": "形如∃x∈M, p(x)的命题，表示在集合M中，至少存在一个元素x使得命题p(x)成立。"
    },
    {
        "id": "6e450277-f4e0-46fc-bf62-2e873ae634ac",
        "label": "全称量词命题的否定",
        "title": "全称量词命题p:∀x∈M, p(x)的否定是∃x∈M, ¬p(x)，即在集合M中存在至少一个元素x使得命题p(x)不成立。"
    },
    {
        "id": "3c699926-1460-4c4d-b8f2-e402b0e854ab",
        "label": "存在量词命题的否定",
        "title": "存在量词命题p:∃x∈M, p(x)的否定是∀x∈M, ¬p(x)，即对于集合M中的所有元素x，命题p(x)都不成立。"
    }

];

const edges = [
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "ad4c2318-d2cb-475e-9642-ab33de1ca178"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "7e9996ce-04f6-4021-845d-159228bf90c0"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "2531318c-344c-46bd-b4ff-b30e8db24f89"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "721c22b5-96fd-411d-ba1a-b52107388b29"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "83409f42-576a-46da-a889-c2aa31158620"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "98eff3f1-d7ce-492c-b000-d9d94d4a6cdd"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "de767a5f-6749-406e-b4eb-9a686e6ef21c"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "cdd5156c-b7d9-43fd-9f83-13226060b1d1"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "7b3d530c-5ddb-4d78-81da-60b9f76166f1"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "6588a978-d737-406e-8834-97a3171301c6"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "ddee0017-9841-4a09-a909-65341fe39c62"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "2462fa68-1f53-4258-88ab-92ec5965aaac"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "a17c57eb-05a0-4e4d-ae55-c97e5d9e2f8a"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "492d2abf-2a3d-41d8-a9ff-24e5c891cfc6"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "4c58446a-5e62-4442-a836-46edd51f8123"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "bdfc1897-596d-4a41-97f8-9b2e5a8f1bc0"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "22950305-e2dd-4caa-974a-f8043d229f88"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "d6e8f230-1caf-4965-af21-991c277a8e13"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "8b8c0edd-fb5b-46fd-9bb4-e6632f6fa689"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "a768bb7a-1db0-4d2f-92b6-0ac71d1c7bc2"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "c2835ab8-a1fd-4494-b8c5-a1f0f1d35d28"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "453103ab-4251-4418-8269-579af720c5fc"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "69de79bd-d5c4-46a9-84a5-0b236aa126a5"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "481357de-34fc-48dd-8547-2e0837f7d723"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "566dd5b0-055b-45d6-b03b-8768f4ed31bd"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "e228c673-adb6-4abe-9d1a-8266763631b4"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "2e8051de-8264-45a4-bb93-5d1b1e453fba"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "6cfed971-16e9-4ec1-a294-4daf4eb098af"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "d2d591c1-119c-4059-a680-d9fa7c69a1b7"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "667755f0-9f2f-42b1-9395-a37b6c901a5c"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "3bb97607-22c0-4d2d-bd74-a0ba2419bc1d"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "d16aa4fc-1db8-4cac-b094-629149cbb289"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "0e08011f-2fb6-400d-a043-f63dd5909064"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "81f0e40d-af1f-479b-863c-456044680411"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "27c1fb22-316b-47ad-b2fe-2e6b615b96b2"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "e6503b17-0ffe-4d0f-a02b-b3275cd6bbe5"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "df65e76c-1191-4231-aab5-c1eee2f585c6"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "69f737c2-8f19-47d4-92c2-83fd36c6a5f4"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "2a435b94-ca9c-4227-9ca9-962cfb99cdc8"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "f62c9dd2-7be1-40c2-ac1e-be6e269f44ff"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "6a275351-cc57-4516-b1ca-ec861db8a98f"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "ffafcc9f-27ed-4112-852c-d3c6b762dc5d"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "426b8862-034e-4fd2-8edc-3e6ddf909773"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "b7c86c5d-fab6-4010-95b1-3501ba807194"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "b6efcf54-5f2d-424e-90b6-823409f4e5d3"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "1618789e-1dd5-4826-9bd7-3715b3e90867"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "50a88c78-65dd-4706-982d-db20ceeb214d"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "a6c3fcb8-97ba-4e13-84c5-4f30d3931469"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "8e7f1761-57ab-45ae-846a-a6578226a576"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "66ee9f26-4017-4f69-a869-a9bdc58e928e"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "f42ed5d6-bd2a-4ecf-8b2d-58d22bbefe9d"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "ad353e8c-f5fb-417a-8ce1-4035359ef33d"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "4ef6938f-a6f5-46e7-b3dd-cb6c0b17059d"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "84f65124-3368-4c69-bc8b-e45f99feaa85"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "0b6b79f6-703a-4cf2-ac91-14b2a8f89e6e"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "fa496ebb-0dba-45cb-846f-5a1d8852fd33"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "862219bc-6771-4a60-99c3-851abe9c2bad"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "a5a1633e-7e8b-4d58-9f11-e8d120137407"
    },
    {
        "from": "b3e9a90e-6a14-4bda-9d5b-62ee2c5c8b25",
        "to": "7e10f20e-3131-4b30-a7eb-8b81aef34567",
        "id": "968a4b8b-e959-4832-af97-31e2cd7c1456"
    }
];

const visContainer = ref(null);

onMounted(() => {
    const graphData = {
        nodes: nodes,
        edges: edges
    };

    const options = {
        nodes: {
            shape: 'dot',
            size: 15,
            font: {
                size: 14
            }
        },
        edges: {
            width: 2
        }
    };

    const network = new Network(visContainer.value, graphData, options);
});
</script>

<style scoped>
.vis-container {
    width: 100%;
    height: 500px;
    /* Adjust height as needed */
    border: 1px solid #ccc;
}
</style>
